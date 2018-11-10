import { RateRequest, RestrictionRules } from "src/controllers/types";
import { Fee } from "@models";
import { DEFAULT_FEE } from "@config/Consts";
import { getDataFromIP } from "./IPData";

export interface Rate {
    fee: number;
    reason?: string;
}
export async function findFee(rate: RateRequest): Promise<Rate> {
    const fees = (await Fee.findAll())
        .sort((a, b) => a.rate - b.rate);

    // go through fees to find matching restrictions
    for (let fee of fees) {
        const restrictions = JSON.parse(fee.restrictions) as RestrictionRules;
        const clientIPData = await getDataFromIP(rate.client.ip);
        const freelancerIPData = await getDataFromIP(rate.freelancer.ip);

        const clientMatches = restrictions.client.location.country === clientIPData.country_code;
        const freelancerMatches = restrictions.freelancer.location.country === freelancerIPData.country_code;

    }
    const fee: Fee = undefined;

    if (fee) {
        return {
            fee: fee.rate,
            reason: fee.name
        }   
    }

    return {
        fee: DEFAULT_FEE,
    }
}



// Recursive parser for the restriction rules
// They can go to an arbitrary depth
// function (rule, data, currentBoolean)

// data
// switch(rule) {
//     @or: 
//     currentBoolean= currentBoolean && function()
// }
