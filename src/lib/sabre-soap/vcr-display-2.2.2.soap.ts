import createSoapEnvelope, { defaultSoapOptions, SoapOptions } from "../soap/soap-envelope";

const vcrDisplayRequest = (ticketNumber: string, options?: SoapOptions): string => {

  const soapBody = `
  <VCR_DisplayRQ xmlns="http://webservices.sabre.com/sabreXML/2011/10" Version="2.2.2">
    <SearchOptions>
        <Ticketing eTicketNumber="${ticketNumber}"/>
    </SearchOptions>
  </VCR_DisplayRQ>`;

  return createSoapEnvelope('VCR_DisplayLLSRQ', soapBody, options);
};

export default vcrDisplayRequest;
