export interface Party {
    ip: '217.127.206.227';
}
export interface Mission {
    duration: string;
}
export interface CommercialRelation {
    firstMission: string;
    lastMission: string
};
export interface RateRequest {
    client: Party;
    freelancer: Party;
    mission: Mission;
    commercialRelation?: CommercialRelation;
}

export interface RestrictionRules {
    client: {
        location: {
            country: string;
        };
    };
    freelancer: {
        location: {
            country: string;
        };
    };
    [key: string]: any;
};

export interface RuleCreation {
    name: string;
    rate: number;
    restrictions?: RestrictionRules;
}
