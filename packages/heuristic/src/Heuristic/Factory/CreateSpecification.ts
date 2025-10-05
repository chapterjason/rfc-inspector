import type {RuleSpecification} from "../RuleSpecification.js";
import type {Specification} from "../Specification.js";
import {ParametersRecord} from "@rfc-inspector/common";

export function createSpecification<
    TItem,
    TType = string,
    TContextParameters extends ParametersRecord = ParametersRecord
>(
    rules: RuleSpecification<TItem, TType, TContextParameters>[]
): Specification<TItem, TType, TContextParameters> {
    return {
        rules,
    };
}
