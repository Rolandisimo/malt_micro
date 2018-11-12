import { RateRequest, RestrictionRules, Rule, LogOps } from "src/controllers/types";
import { Fee } from "@models";
import { DEFAULT_FEE } from "@config/Consts";
import { getDataFromIP, IPDAta } from "./IPData";

/**
 * Used in restriction validation
 * Stores requested info about the party
 */
let clientIPData: IPDAta;
let freelancerIPData: IPDAta;
async function requestAndStorePartyData(rate: RateRequest) {
    clientIPData = await getDataFromIP(rate.client.ip);
    freelancerIPData = await getDataFromIP(rate.freelancer.ip);
}

/**
 * Determine how data should be
 * accessed and what info passed.
 *
 * Necessary because logical ops
 * are passed as an array
 * as opposed to rules that are maps
 *
 * @param restrictions Current level restriction rules
 * @param key Current key
 */
function getInfoToValidate(restrictions: RestrictionRules, key: string) {
    const isDataAsArray = Array.isArray(restrictions);
    const keyToPass = isDataAsArray
        ? Object.keys(restrictions[key])[0]
        : key;
    const dataToPass = isDataAsArray
        ? restrictions[key][keyToPass]
        : restrictions[key];
    const logOpsInfoToPass = isDataAsArray
        ? (keyToPass === LogOps.And || keyToPass === LogOps.Or) && keyToPass
        : (key === LogOps.And || key === LogOps.Or) && key;

    return {
        keyToPass,
        dataToPass,
        logOpsInfoToPass,
    }
}

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
    /**
     * Determine whether the
     * logical OR operation
     * is valid
     */
    let logicalORValid: boolean;

    for (const key in restrictions) {
        const {
            keyToPass,
            dataToPass,
            logOpsInfoToPass,
        } = getInfoToValidate(restrictions, key)

        const isMatched = validateRestriction(
            keyToPass,
            dataToPass,
            logOpsInfoToPass || logOps,
        );

        if (logOps === LogOps.Or) {
            if (isMatched) {
                logicalORValid = true;
                break;
            } else {
                logicalORValid = false;
            }
        } else if (!isMatched) {
            return false;
        }
    }

    /**
     * Here we can have either
     * valid AND
     * valid Rule
     * (in)valid OR
     */
    if (logOps === LogOps.Or) {
        return logicalORValid;
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

    await requestAndStorePartyData(rate);

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

