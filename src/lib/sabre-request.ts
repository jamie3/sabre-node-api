import config from "config-dug";
import request, { Headers } from "request";

const sabreUrl = config.SABRE_URL as string;

const sabreRequest = request.defaults({ uri: sabreUrl });

export default sabreRequest;
