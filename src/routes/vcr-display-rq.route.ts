import express, { NextFunction, Request, Response } from "express";

import vcrDisplayRequest from "../lib/sabre-soap/vcr-display-2.2.2.soap"
import sabreRequest from "../lib/sabre/sabre-request";
import extractSoapEnvelope from "../lib/soap/extract-soap-envelope";

const router = express.Router();

interface VCRDisplayResponse {
    body: string
    error?: string
}

const vcrDisplayRoute = (request: Request, response: Response, next: NextFunction) => {

    const ticketNumber = request.params.ticketNumber as string

    const token = request.headers.authorization?.replace("Bearer ", "")

    const xml = vcrDisplayRequest(ticketNumber, { token });

    console.log(xml);

    sabreRequest.post({ body: xml },
        (error, res, body) => {
            if (error) {
                next(error);
            } else {

                const soapEnvelope = extractSoapEnvelope(body);

                if (soapEnvelope.fault) {
                    if (soapEnvelope.fault.name.match(/InvalidSecurityToken/)) {
                        response.status(403).json({error: soapEnvelope.fault.name, message: soapEnvelope.fault.message})
                    } else {
                        response.status(500).json({error: soapEnvelope.fault.name, message: soapEnvelope.fault.message})
                    }
                } else if (soapEnvelope.error) {
                    response.status(500).json({error: soapEnvelope.error.name, message: soapEnvelope.error.message})
                } else {
                    response.status(200).send(soapEnvelope.body)
                }
            }
        }
    );
};

router.get("/vcr-display/:ticketNumber", vcrDisplayRoute);

export default router;
