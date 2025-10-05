import type {Classification} from "./Classification.js";
import type {ParametersRecord} from "@rfc-inspector/common";

export type OverlapResolver<
    TItem,
    TType = string,
    TContextParameters extends ParametersRecord = ParametersRecord
> = (
    current: Classification<TItem, TType, TContextParameters> | null,
    incoming: Classification<TItem, TType, TContextParameters>
) => Classification<TItem, TType, TContextParameters>;