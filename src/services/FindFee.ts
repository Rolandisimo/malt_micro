import { RateRequest, RestrictionRules, Rule, LogOps } from "src/controllers/types";
import { Fee } from "@models";
import { DEFAULT_FEE } from "@config/Consts";
import { getDataFromIP, IPDAta } from "./IPData";

let clientIPData: IPDAta;
let freelancerIPData: IPDAta;

// Recursive parser for the restriction rules
// They can go to an arbitrary depth
function validateRestriction(key: string, data: RestrictionRules, logOps?: LogOps) {
    switch(key) {
        case Rule.MissionrelationDuration:
        case Rule.СommercialrelationDuration: {
            // TODO: Implement
            return true;
        }
        case Rule.FreelancerLocation: {
            return data.country === freelancerIPData.country_code;
        }
        case Rule.ClientLocation: {
            return data.country === clientIPData.country_code;
        }
        case LogOps.Or:
        case LogOps.And: {
            return traverseKeys(data, logOps)
        }
    }
}
function traverseKeys(restrictions: RestrictionRules, logOps?: LogOps) {    
    let logOpsRuleMatched = true;

    for (const key in restrictions) {
        let isMatched: boolean;

        if (Array.isArray(restrictions)) {
            const currentRuleKey = Object.keys(restrictions[key])[0];

            isMatched = validateRestriction(
                currentRuleKey,
                restrictions[key][currentRuleKey],
                ((currentRuleKey === LogOps.And || currentRuleKey === LogOps.Or) && currentRuleKey) || logOps
            );
        } else {
            isMatched = validateRestriction(
                key,
                restrictions[key],
                ((key === LogOps.And || key === LogOps.Or) && key) || logOps,
            );
        }

        if (logOps === LogOps.Or) {
            if (isMatched) {
                return true;
            } else {
                logOpsRuleMatched = false;
            }
        } else if (!isMatched) {
            return false;
        }
    }

    // TODO: Improve syntax
    if (logOps === LogOps.Or && !logOpsRuleMatched) {
        return false;
    }

    return true;
}


export interface Rate {
    fee: number;
    reason?: string;
}

export async function findFee(rate: RateRequest): Promise<Rate> {
    const fees = (await Fee.findAll())
        .sort((a, b) => a.rate - b.rate);

    clientIPData = await getDataFromIP(rate.client.ip);
    freelancerIPData = await getDataFromIP(rate.freelancer.ip);

    // Iterate over fees to find matching restrictions
    let FoundFee: Fee;
    for (let fee of fees) {
        const restrictions = JSON.parse(fee.restrictions) as RestrictionRules;

        const isFeeMatched = traverseKeys(restrictions);
        if (isFeeMatched) {
            FoundFee = fee
            break;
        } else {
            continue;
        }
    }

    if (FoundFee) {
        return {
            fee: FoundFee.rate,
            reason: FoundFee.name
        }   
    }

    return {
        fee: DEFAULT_FEE,
    }
}
