import config from "config-dug";
import moment from "moment";
import uuid from "uuid/v4";

const organization = config.ORGANIZATION as string;

const tokenCreateRequest = (partyId: string, sabreUsername: string, sabrePassword: string, conversationId: string | null = uuid()): string => {

    const timestamp = moment().toISOString();
    const messageId = uuid();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:sec="http://schemas.xmlsoap.org/ws/2002/12/secext"
    xmlns:eb="http://www.ebxml.org/namespaces/messageHeader"
    xmlns:ns="http://www.opentravel.org/OTA/2002/11">
<soapenv:Header>
    <eb:MessageHeader eb:version="1">
        <eb:From>
            <eb:PartyId>${partyId}</eb:PartyId>
        </eb:From>
        <eb:To>
            <eb:PartyId>webservices.sabre.com</eb:PartyId>
        </eb:To>
        <eb:CPAId>${organization}</eb:CPAId>
        <eb:ConversationId>${conversationId}</eb:ConversationId>
        <eb:Service>Session</eb:Service>
        <eb:Action>TokenCreateRQ</eb:Action>
        <eb:MessageData>
            <eb:MessageId>${messageId}</eb:MessageId>
            <eb:Timestamp>${timestamp}</eb:Timestamp>
        </eb:MessageData>
    </eb:MessageHeader>
    <wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/12/secext"
            xmlns:wsu="http://schemas.xmlsoap.org/ws/2002/12/utility">
        <wsse:UsernameToken>
            <wsse:Username>${sabreUsername}</wsse:Username>
            <wsse:Password>${sabrePassword}</wsse:Password>
            <Organization>${organization}</Organization>
            <Domain>${organization}</Domain>
        </wsse:UsernameToken>
    </wsse:Security>
</soapenv:Header>
<soapenv:Body>
    <TokenCreateRQ Version="1.0.0"/>
</soapenv:Body>
</soapenv:Envelope>`;

    return xml;
};

export default tokenCreateRequest;
