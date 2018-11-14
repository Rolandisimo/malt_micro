import { RuleCreation } from "../types";
import { RequestParamValidate } from "@errors";

export const validateRule = (body: RuleCreation) => {
    const {
        name,
        rate,
        restrictions,
    } = body;

    try {
        if (restrictions && !Array.isArray(restrictions)) {
            JSON.parse(JSON.stringify(restrictions));
        }

        if (name && rate >= 0) {
            return;
        }
    } catch (error) {
        throw new RequestParamValidate("Added an incorrectly formatted rule");
    }
};
