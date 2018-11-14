import { RateRequest } from "../types";
import { RequestParamValidate } from "@errors";

// tslint:disable-next-line:max-line-length
const IPRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/g;

export const validateRate = (body: RateRequest) => {
    const {
        client,
        commercialRelation,
        freelancer,
        mission,
    } = body;

    const clientMatch = client && client.ip.match(IPRegex);
    const freelancerMatch = freelancer && freelancer.ip.match(IPRegex);

    if (!client || !clientMatch) {
        throw new RequestParamValidate("Client is invalid. Should container client.ip");
    }

    if (!freelancer || !freelancerMatch) {
        throw new RequestParamValidate("Freelancer is invalid. Should contain freelancer.ip");
    }

    if (!mission || mission.duration === undefined) {
        throw new RequestParamValidate(
            "Mission duration formatted incorrectly."
            + "Should contain mission.duration"
        );
    }

    if (!commercialRelation || !(commercialRelation.firstMission && commercialRelation.lastMission)) {
        throw new RequestParamValidate(
            "Commercial relationships formatted incorrectly.\n"
            + "Should contain commercialRelation.(firstMission, lastMission)"
        );
    }
};
