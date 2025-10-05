import type {ScoringFunction} from "./ScoringFunction.js";
import type {OverlapResolver} from "./OverlapResolver.js";
import {ParametersRecord} from "@rfc-inspector/common";

export interface AnalyzerOptions<
    TItem,
    TType = string,
    TContextParameters extends ParametersRecord = ParametersRecord
> {
    scoringFunction: ScoringFunction<TItem, TType, TContextParameters>;
    overlapResolver: OverlapResolver<TItem, TType, TContextParameters>;
}
