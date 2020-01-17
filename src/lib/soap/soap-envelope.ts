import config from "config-dug"
import moment from "moment"
import uuid from "uuid/v4"

export interface SoapOptions {
    partyId?: string
    domain?: string
    organization?: string
    username?: string,
    password?: string,
    token?: string
}

export const defaultSoapOptions = (options?: SoapOptions):SoapOptions => {
    return {
        partyId: config.PARTY_ID as string,
        domain: config.DOMAIN as string,
        organization: config.ORGANIZATION as string,
        ...options
    }
}

const createSecurityHeader = (options: SoapOptions): string => {
    if (options.username && options.password) {
        return `
        <wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/12/secext"
                xmlns:wsu="http://schemas.xmlsoap.org/ws/2002/12/utility">
            <wsse:UsernameToken>
                <wsse:Username>${options.username}</wsse:Username>
                <wsse:Password>${options.password}</wsse:Password>
                <Organization>${options.organization}</Organization>
                <Domain>${options.domain}</Domain>
            </wsse:UsernameToken>
        </wsse:Security>`
    } else if (options.token) {
        return `
        <Security xmlns="http://schemas.xmlsoap.org/ws/2002/12/secext"
                xmlns:wsu="http://schemas.xmlsoap.org/ws/2002/12/utility">
            <BinarySecurityToken wsu:Id="SabreSecurityToken" valueType="String" EncodingType="wsse:Base64Binary">${options.token}</BinarySecurityToken>
        </Security>`;
    }

    return '';
}

const createSoapEnvelope = (action: string, body: string, options?: SoapOptions): string => {

    const timestamp = moment().toISOString();
    const messageId = uuid();
    const conversationId = uuid();

    console.log(options);

    const soapOptions = defaultSoapOptions(options)

    const security = createSecurityHeader(soapOptions)

    const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
            xmlns:sec="http://schemas.xmlsoap.org/ws/2002/12/secext"
            xmlns:eb="http://www.ebxml.org/namespaces/messageHeader"
            xmlns:ns="http://www.opentravel.org/OTA/2002/11">
        <soapenv:Header>
        <eb:MessageHeader eb:version="1">
            <eb:From>
                <eb:PartyId>${soapOptions.partyId}</eb:PartyId>
            </eb:From>
            <eb:To>
                <eb:PartyId>webservices.sabre.com</eb:PartyId>
            </eb:To>
            <eb:CPAId>${soapOptions.organization}</eb:CPAId>
            <eb:ConversationId>${conversationId}</eb:ConversationId>
            <eb:Action>${action}</eb:Action>
            <eb:MessageData>
                <eb:MessageId>${messageId}</eb:MessageId>
                <eb:Timestamp>${timestamp}</eb:Timestamp>
            </eb:MessageData>
        </eb:MessageHeader>
        ${security}
    </soapenv:Header>
    <soapenv:Body>
    ${body}
    </soapenv:Body>
    </soapenv:Envelope>`;

    return soapEnvelope;
}

export default createSoapEnvelope;