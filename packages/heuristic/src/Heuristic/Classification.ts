/**
 * Classification result for pure type labeling - works directly with type identifiers
 */
import type {RuleInterface} from "./Rule/RuleInterface.js";
import type {RuleResult} from "./Rule/RuleResult.js";
import type {ParametersRecord} from "@rfc-inspector/common";

export interface Classification<
    TItem,
    TType = string,
    TContextParameters extends ParametersRecord = ParametersRecord
> {
    index: number;
    length: number;
    rule: RuleInterface<TItem, TType, TContextParameters>;
    score: number;
    result: RuleResult;
}