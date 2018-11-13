import { RuleCreation } from "../types";
import { RequestParamValidate } from "@errors";

export const validateRule = (body: RuleCreation) => {
    const {
        name,
        rate,
    } = body;

    if (name && rate >= 0) {
        return;
    }

    throw new RequestParamValidate('Added an incorrectly formatted rule');
}
