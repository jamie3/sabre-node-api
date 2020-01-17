import config from "config-dug";

import createSoapEnvelope from "../soap/soap-envelope";

const sabreUsername = config.SABRE_USERNAME as string
const sabrePassword = config.SABRE_PASSWORD as string

const tokenCreateRequest = (): string => {

    const body = `<TokenCreateRQ Version="1.0.0"/>`;

    const soapEnvelope = createSoapEnvelope('TokenCreateRQ', body, { username: sabreUsername, password: sabrePassword });
    console.log(soapEnvelope);
    return soapEnvelope;
};

export default tokenCreateRequest;
