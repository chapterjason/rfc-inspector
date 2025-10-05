import type {RuleSpecification} from "./RuleSpecification.js";
import {ParametersRecord} from "@rfc-inspector/common";

export type ScoringFunction<
    TItem,
    TType = string,
    TContextParameters extends ParametersRecord = ParametersRecord
> = (
    rule: RuleSpecification<TItem, TType, TContextParameters>,
    matchScore: number
) => number;
