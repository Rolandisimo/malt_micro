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
        const foundFee = (await Fee.findAll())
            .sort((a, b) => a.rate - b.rate)
            .find(fee => this.traverseKeys(JSON.parse(fee.restrictions)));

        if (foundFee) {
            return {
                fee: foundFee.rate,
                reason: foundFee.name
            };
        }

        return {
            fee: DEFAULT_FEE,
        };
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
                restrictionToPass,
                logOpsInfoToPass,
            } = this.getInfoToValidate(restrictions, key);

            const isMatched = this.validateRestriction(
                keyToPass,
                restrictionToPass,
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
        const restrictionToPass = isDataAsArray
            ? restrictions[key][keyToPass]
            : restrictions[key];
        const logOpsInfoToPass = isDataAsArray
            ? (keyToPass === LogOps.And || keyToPass === LogOps.Or) && keyToPass
            : (key === LogOps.And || key === LogOps.Or) && key;

        return {
            keyToPass,
            restrictionToPass,
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
    private formatDuration(duration: number | string) {
        return `${duration}months`;
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

    /**
     * Recursive parser for the restriction rules
     * They can go to an arbitrary depth
     *
     * @param key Current key
     * @param restriction Map or Array of rules
     * @param logOps Logical operator info to determine nested rules
     */
    private validateRestriction(
        key: string,
        restriction: RestrictionRules,
        logOps: LogOps,
    ) {
        switch(key) {
            case Rule.MissionrelationDuration: {
                const comparisonOp = Object.keys(restriction)[0] as Comparison;
                return this.compareDurations(comparisonOp, this.missionDuration, restriction[comparisonOp]);
            }
            case Rule.СommercialrelationDuration: {
                const comparisonOp = Object.keys(restriction)[0] as Comparison;
                return this.compareDurations(comparisonOp, this.commercialRelationPeriod, restriction[comparisonOp]);
            }
            case Rule.FreelancerLocation: {
                return restriction.country === this.freelancerIPData.country_code;
            }
            case Rule.ClientLocation: {
                return restriction.country === this.clientIPData.country_code;
            }
            case LogOps.Or:
            case LogOps.And: {
                return this.traverseKeys(restriction, logOps);
            }
        }
    }
}
