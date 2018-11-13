import moment from "moment";
import { Fee } from "@models";
import { DEFAULT_FEE } from "@config/Consts";
import {
    RateRequest,
    RestrictionRules,
    Rule,
    LogOps,
    Comparison,
    Rate,
} from "src/controllers/types";
import { getDataFromIP, IPDAta } from "./IPData";

// // TODO: Moves variables to a Class
// /**
//  * Used in restriction validation
//  * Stores requested location
//  * info about the party based
//  * on their IP addresses
//  */
// let clientIPData: IPDAta;
// let freelancerIPData: IPDAta;
// /**
//  * Duration of the proposed mission
//  */
// let missionDuration: string;
// /**
//  * How long parties have been working together
//  */
// let commercialRelationPeriod: string;
// async function requestAndStorePartyData(rate: RateRequest) {
//     clientIPData = await getDataFromIP(rate.client.ip);
//     freelancerIPData = await getDataFromIP(rate.freelancer.ip);
// }

// /**
//  * Determine how data should be
//  * accessed and what info passed.
//  *
//  * Necessary because logical ops
//  * are passed as an array
//  * as opposed to rules that are maps
//  *
//  * @param restrictions Current level restriction rules
//  * @param key Current key
//  */
// function getInfoToValidate(restrictions: RestrictionRules, key: string) {
//     const isDataAsArray = Array.isArray(restrictions);
//     const keyToPass = isDataAsArray
//         ? Object.keys(restrictions[key])[0]
//         : key;
//     const dataToPass = isDataAsArray
//         ? restrictions[key][keyToPass]
//         : restrictions[key];
//     const logOpsInfoToPass = isDataAsArray
//         ? (keyToPass === LogOps.And || keyToPass === LogOps.Or) && keyToPass
//         : (key === LogOps.And || key === LogOps.Or) && key;

//     return {
//         keyToPass,
//         dataToPass,
//         logOpsInfoToPass,
//     };
// }

// /**
//  *
//  * @param duration string in a <NUMBER>months format
//  */
// function parseDuration(duration: string) {
//     return parseInt(duration, 10);
// }
// function compareDurations(
//     comparisonOp: Comparison,
//     sentDuration: string,
//     requiredDuration: string,
// ) {
//     const sentDurationNum = parseDuration(sentDuration);
//     const requiredDurationNum = parseDuration(requiredDuration);

//     switch(comparisonOp) {
//         case Comparison.Eq: {
//             return sentDurationNum === requiredDurationNum;
//         }
//         case Comparison.Ge: {
//             return sentDurationNum >= requiredDurationNum;
//         }
//         case Comparison.Gt: {
//             return sentDurationNum > requiredDurationNum;
//         }
//         case Comparison.Le: {
//             return sentDurationNum <= requiredDurationNum;
//         }
//         case Comparison.Lt: {
//             return sentDurationNum < requiredDurationNum;
//         }
//         default: {
//             new Error("Incorrect comparison operator passed");
//         }
//     }
// }

// // Recursive parser for the restriction rules
// // They can go to an arbitrary depth
// function validateRestriction(key: string, data: RestrictionRules, logOps?: LogOps) {
//     switch(key) {
//         case Rule.MissionrelationDuration: {
//             const comparisonOp = Object.keys(data)[0] as Comparison;
//             return compareDurations(comparisonOp, missionDuration, data[comparisonOp]);
//         }
//         case Rule.СommercialrelationDuration: {
//             const comparisonOp = Object.keys(data)[0] as Comparison;
//             return compareDurations(comparisonOp, commercialRelationPeriod, data[comparisonOp]);
//         }
//         case Rule.FreelancerLocation: {
//             return data.country === freelancerIPData.country_code;
//         }
//         case Rule.ClientLocation: {
//             return data.country === clientIPData.country_code;
//         }
//         case LogOps.Or:
//         case LogOps.And: {
//             return traverseKeys(data, logOps);
//         }
//     }
// }
// function traverseKeys(restrictions: RestrictionRules, logOps?: LogOps) {
//     /**
//      * Determine whether the
//      * logical OR operation
//      * is valid
//      */
//     let logicalORValid: boolean;

//     for (const key in restrictions) {
//         const {
//             keyToPass,
//             dataToPass,
//             logOpsInfoToPass,
//         } = getInfoToValidate(restrictions, key);

//         const isMatched = validateRestriction(
//             keyToPass,
//             dataToPass,
//             logOpsInfoToPass || logOps,
//         );

//         if (logOps === LogOps.Or) {
//             if (isMatched) {
//                 logicalORValid = true;
//                 break;
//             } else {
//                 logicalORValid = false;
//             }
//         } else if (!isMatched) {
//             return false;
//         }
//     }

//     /**
//      * Here we can have either
//      * valid AND
//      * valid Rule
//      * (in)valid OR
//      */
//     if (logOps === LogOps.Or) {
//         return logicalORValid;
//     }

//     return true;
// }

// /**
//  * Formatting has to adjusted if
//  * any other date values
//  * like days, weeks, years are used
//  */
// function formatDuration(duration: number | string) {
//     return `${duration}months`;
// }

// export interface Rate {
//     fee: number;
//     reason?: string;
// }
// export async function findFee(rate: RateRequest): Promise<Rate> {
//     const firstContactTime = moment(rate.commercialRelation.firstMission);
//     const lastContactTime = moment(rate.commercialRelation.lastMission);
//     const periodDelta = lastContactTime.diff(firstContactTime);

//     commercialRelationPeriod = formatDuration(moment.duration(periodDelta).asMonths().toFixed());
//     missionDuration = rate.mission.duration;
//     await requestAndStorePartyData(rate);

//     /**
//      * Iterate over fees to find matching restrictions
//      * The fee with the lowest rate takes priority
//      */
//     const FoundFee = (await Fee.findAll())
//         .sort((a, b) => a.rate - b.rate)
//         .find(fee => traverseKeys(JSON.parse(fee.restrictions)));

//     if (FoundFee) {
//         return {
//             fee: FoundFee.rate,
//             reason: FoundFee.name
//         };
//     }

//     return {
//         fee: DEFAULT_FEE,
//     };
// }

export class FeeLocator {
    private commercialRelationPeriod: string;
    private missionDuration: string;
    private clientIPData: IPDAta;
    private freelancerIPData: IPDAta;
    private rate: RateRequest;

    public constructor(rate: RateRequest) {
        this.rate = rate;
        const {
            commercialRelation: {
                lastMission,
                firstMission,
            },
            mission,
        } = this.rate;

        const firstContactTime = moment(firstMission);
        const lastContactTime = moment(lastMission);
        const periodDelta = lastContactTime.diff(firstContactTime);
        const relationshipDuration = moment.duration(periodDelta).asMonths().toFixed();

        this.commercialRelationPeriod = this.formatDuration(relationshipDuration);
        this.missionDuration = mission.duration;
    }

    public async findMatchingFee(): Promise<Rate> {
        this.clientIPData = await getDataFromIP(this.rate.client.ip);
        this.freelancerIPData = await getDataFromIP(this.rate.freelancer.ip);

        /**
         * Iterate over fees to find matching restrictions
         * The fee with the lowest rate takes priority
         */
        const FoundFee = (await Fee.findAll())
            .sort((a, b) => a.rate - b.rate)
            .find(fee => this.traverseKeys(JSON.parse(fee.restrictions)));

        if (FoundFee) {
            return {
                fee: FoundFee.rate,
                reason: FoundFee.name
            };
        }

        return {
            fee: DEFAULT_FEE,
        };
    }

    private formatDuration(duration: number | string) {
        return `${duration}months`;
    }

    private traverseKeys(restrictions: RestrictionRules, logOps?: LogOps) {
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
            } = this.getInfoToValidate(restrictions, key);

            const isMatched = this.validateRestriction(
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
    private getInfoToValidate(restrictions: RestrictionRules, key: string) {
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
        };
    }

    /**
     *
     * @param duration string in a <NUMBER>months format
     */
    private parseDuration(duration: string) {
        return parseInt(duration, 10);
    }

    private compareDurations(
        comparisonOp: Comparison,
        sentDuration: string,
        requiredDuration: string,
    ) {
        const sentDurationNum = this.parseDuration(sentDuration);
        const requiredDurationNum = this.parseDuration(requiredDuration);

        switch(comparisonOp) {
            case Comparison.Eq: {
                return sentDurationNum === requiredDurationNum;
            }
            case Comparison.Ge: {
                return sentDurationNum >= requiredDurationNum;
            }
            case Comparison.Gt: {
                return sentDurationNum > requiredDurationNum;
            }
            case Comparison.Le: {
                return sentDurationNum <= requiredDurationNum;
            }
            case Comparison.Lt: {
                return sentDurationNum < requiredDurationNum;
            }
            default: {
                new Error("Incorrect comparison operator passed");
            }
        }
    }

    // Recursive parser for the restriction rules
    // They can go to an arbitrary depth
    private validateRestriction(key: string, data: RestrictionRules, logOps?: LogOps) {
        switch(key) {
            case Rule.MissionrelationDuration: {
                const comparisonOp = Object.keys(data)[0] as Comparison;
                return this.compareDurations(comparisonOp, this.missionDuration, data[comparisonOp]);
            }
            case Rule.СommercialrelationDuration: {
                const comparisonOp = Object.keys(data)[0] as Comparison;
                return this.compareDurations(comparisonOp, this.commercialRelationPeriod, data[comparisonOp]);
            }
            case Rule.FreelancerLocation: {
                return data.country === this.freelancerIPData.country_code;
            }
            case Rule.ClientLocation: {
                return data.country === this.clientIPData.country_code;
            }
            case LogOps.Or:
            case LogOps.And: {
                return this.traverseKeys(data, logOps);
            }
        }
    }
}
