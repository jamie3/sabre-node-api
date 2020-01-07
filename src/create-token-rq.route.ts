import express, { Request, Response, NextFunction } from "express";
import { Headers } from "request";
import parser from "xml2json";

import sabreRequest from "./lib/sabre-request";
import tokenCreateRequest from "./lib/token-create-request";

const router = express.Router();
const headers: Headers = {
    "Content-Type": "text/xml"
};

interface CreateTokenResponse {
    conversationId: string,
    messageId: string,
    timestamp: string,
    token: string
}

const createToken = (request: Request, response: Response, next: NextFunction) => {

    const xml = tokenCreateRequest(request.body.partyId, request.body.username, request.body.password, request.body.conversationId);

    sabreRequest.post({ body: xml, headers },
        (error, res, body) => {
            if (error) {
                next(error);
            } else {

                const json = JSON.parse(parser.toJson(body));

                const soapHeader = json['soap-env:Envelope']['soap-env:Header'];
                const soapBody = json['soap-env:Envelope']['soap-env:Body'];
                const ebMessageHeader = soapHeader['eb:MessageHeader'];
                const ebMessageData = ebMessageHeader['eb:MessageData'];

                const tokenResponse: CreateTokenResponse = {
                    conversationId: ebMessageHeader['eb:ConversationId'] as string,
                    messageId: ebMessageData['eb:MessageId'] as string,
                    timestamp: ebMessageData['eb:Timestamp'] as string,
                    token: soapHeader['wsse:Security']['wsse:BinarySecurityToken']['$t'] as string,
                }
                response.status(201).json(tokenResponse);
            }
        }
    );
};

router.post("/token", createToken);

export default router;
