import {ParametersRecord} from "@rfc-inspector/common";
import type {RuleSpecification} from "./RuleSpecification.js";

export interface Specification<
    TItem,
    TType = string,
    TContextParameters extends ParametersRecord = ParametersRecord
> {
    rules: RuleSpecification<TItem, TType, TContextParameters>[];
}
