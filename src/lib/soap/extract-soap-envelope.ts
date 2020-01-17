import parser from "xml2json";

export interface ebMessageData {
    messageId: string,
    timestamp: string
}

export interface ebMessageHeader {
    conversationId: string,
    ebMessageData: any
}

export interface wsseSecurity {
    binarySecurityToken?: string
}

export interface SoapHeader {
    ebMessageHeader: ebMessageHeader
    wsseSecurity: wsseSecurity
}

export interface SoapEnvelope {
    header: SoapHeader
    body?: any
    error?: SabreError
    fault?: SoapFault
}

export class SabreError extends Error {}
export class SoapFault extends Error {}

const extractSoapEnvelope = (xml: string):SoapEnvelope => {

    console.log("Sabre SOAP Response", xml)

    const json = JSON.parse(parser.toJson(xml));
    const envelope = json['soap-env:Envelope']
    const header = envelope['soap-env:Header'];
    const body = envelope['soap-env:Body'];
    const ebMessageHeader = header['eb:MessageHeader'];
    const ebMessageData = ebMessageHeader['eb:MessageData'];

    const soapEnvelope:SoapEnvelope = {
        header: {
            ebMessageHeader: {
                conversationId: ebMessageHeader['eb:ConversationId'],
                ebMessageData: {
                    messageId: ebMessageData['eb:MessageId'],
                    timestamp: ebMessageData['eb:Timestamp']
                }
            },
            wsseSecurity: {

            }
        }
    }

    if (header['wsse:Security']['wsse:BinarySecurityToken']) {
        soapEnvelope.header.wsseSecurity = {
            binarySecurityToken: header['wsse:Security']['wsse:BinarySecurityToken'].$t as string
        }
    }

    console.log("Response Body", body);

    if (body['soap-env:Fault']) {
        const fault = new SoapFault(body['soap-env:Fault'].faultstring)
        fault.name = body['soap-env:Fault'].faultcode
        soapEnvelope.fault = fault;
    } else if (body.VCR_DisplayRS && body.VCR_DisplayRS['stl:ApplicationResults']['stl:Error']) {
        const ApplicationResults = body.VCR_DisplayRS['stl:ApplicationResults']
        const error = new SabreError(body.VCR_DisplayRS['stl:ApplicationResults']['stl:Error']['stl:SystemSpecificResults']['stl:Message'])
        error.name = ApplicationResults.status
        soapEnvelope.error = error;
    } else {
        soapEnvelope.body = body;
    }

    return soapEnvelope;
}

export default extractSoapEnvelope