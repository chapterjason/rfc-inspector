import {ParametersRecord} from "@rfc-inspector/common";
import type {RuleInterface} from "./Rule/RuleInterface.js";

export interface RuleSpecification<
    TItem,
    TType = string,
    TContextParameters extends ParametersRecord = ParametersRecord
> {
    priority: number;
    rule: RuleInterface<TItem, TType, TContextParameters>;
}