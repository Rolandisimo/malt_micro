import { RateRequest } from "../types";
import { RequestParamValidate } from "@errors";

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
    const hasValidClient = clientMatch && clientMatch.length;
    const hasValidFreelancer = freelancerMatch && freelancerMatch.length;

    const hasValidMission = mission && mission.duration; // TODO: Add proper duration validation
    const hasValidCommercialRelation = commercialRelation && (commercialRelation.firstMission && commercialRelation.lastMission);

    if (hasValidClient && hasValidFreelancer && hasValidMission && (!commercialRelation || hasValidCommercialRelation)) {
        return;
    }

    throw new RequestParamValidate('Request formatted incorrectly');

}
