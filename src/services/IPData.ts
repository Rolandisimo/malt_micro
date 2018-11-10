const IPSTACK_BASE = "http://api.ipstack.com";

import axios from "axios";
import Environment from "@config/Environment";

export interface IPDAta {
    city: string;
    country_code: string;

    /**
     * @see https://ipstack.com/documentation
     * For other types
     */
    [key: string]: any;
}

export async function getDataFromIP(ip: string): Promise<IPDAta> {
    return (await axios.get(`${IPSTACK_BASE}/${ip}?access_key=${Environment.ipStackAPIKEY}`)).data;
}
