import tokenCreateRequest from "../sabre-soap/token-create-1.0.0.soap";
import extractSoapEnvelope from "../soap/extract-soap-envelope";
import sabreRequest from "./sabre-request";

interface Token {
    conversationId: string
    messageId: string
    timestamp: string
    token?: string
    error?: Error
}

export const createToken = (callback?: (token?: Token, error?: Error) => void): void => {

    const xml = tokenCreateRequest();

    sabreRequest.post({ body: xml },
        (error, res, body) => {
            if (callback) {
                if (error) {
                    if (callback) {
                        callback(error)
                    }
                } else {

                    const soapEnvelope = extractSoapEnvelope(body);
                    console.log(soapEnvelope);

                    const tokenResponse: Token = {
                        conversationId: soapEnvelope.header.ebMessageHeader.conversationId,
                        messageId: soapEnvelope.header.ebMessageHeader.ebMessageData.messageId,
                        timestamp: soapEnvelope.header.ebMessageHeader.ebMessageData.timestamp
                    }

                    if (soapEnvelope.fault) {
                        callback(undefined, soapEnvelope.fault);
                    } else if (soapEnvelope.error) {
                        callback(undefined, soapEnvelope.error);
                    } else if (soapEnvelope.body['sws:TokenCreateRS']['sws:Success']) {
                        tokenResponse.token = soapEnvelope.header.wsseSecurity.binarySecurityToken
                        callback(tokenResponse)
                    } else {
                        tokenResponse.error = soapEnvelope.body['sws:TokenCreateRS']
                        callback(tokenResponse)
                    }
                }
            }
        }
    );
}

export default createToken