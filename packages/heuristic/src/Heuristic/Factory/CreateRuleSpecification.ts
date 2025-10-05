import type {RuleSpecification} from "../RuleSpecification.js";
import type {RuleInterface} from "../Rule/RuleInterface.js";
import {ParametersRecord} from "@rfc-inspector/common";

export function createRuleSpecification<
    TItem,
    TType = string,
    TContextParameters extends ParametersRecord = ParametersRecord
>(
    rule: RuleInterface<TItem, TType, TContextParameters>,
    priority = 0
): RuleSpecification<TItem, TType, TContextParameters> {
    return {
        priority,
        rule,
    };
}
