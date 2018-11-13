export interface Party {
    ip: string;
}
export interface Mission {
    duration: string;
}
export interface CommercialRelation {
    firstMission: string;
    lastMission: string;
}
export interface RateRequest {
    client: Party;
    freelancer: Party;
    mission: Mission;
    commercialRelation?: CommercialRelation;
}

export enum LogOps {
    Or = "@or",
    And = "@and",
}
export type LogOpsKeys = { [key in LogOps]?: string; };

export enum Comparison {
    Gt = "gt",
    Lt = "lt",
    Ge = "ge",
    Le = "le",
    Eq = "eq",
}
type ComparisonKeys = { [key in Comparison]?: string; };

export enum Rule {
    СommercialrelationDuration = "@commercialrelation.duration",
    MissionrelationDuration = "@mission.duration",
    ClientLocation = "@client.location",
    FreelancerLocation = "@freelancer.location",
}
export type RuleKeys = { [key in Rule]?: string; };

const enum SubRule {
    Country = "country",
}
type SubRuleKeys = { [key in SubRule]?: string; };

export type RestrictionRules = {
    [LogOps.And]?: RestrictionRules;
    [LogOps.Or]?: RestrictionRules;
    [Rule.ClientLocation]?: SubRuleKeys;
    [Rule.FreelancerLocation]?: SubRuleKeys;
    [Rule.MissionrelationDuration]?: ComparisonKeys;
    [Rule.СommercialrelationDuration]?: ComparisonKeys;
    [key: string]: any;
};

export type RestrictionRuleKeys = keyof RestrictionRules;

export interface RuleCreation {
    name: string;
    rate: number;
    restrictions?: RestrictionRules;
}
