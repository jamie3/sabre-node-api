import config from "config-dug";
import request from "request";
import { Headers } from "request";

const sabreUrl = config.SABRE_URL as string;

export const DefaultHeaders: Headers = {
    "Content-Type": "text/xml"
};

const sabreRequest = request.defaults({ uri: sabreUrl, headers: DefaultHeaders });

export default sabreRequest;
