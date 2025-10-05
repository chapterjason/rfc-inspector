import type {Classification} from "../Classification.js";
import type {RuleInterface} from "../Rule/RuleInterface.js";
import type {RuleResult} from "../Rule/RuleResult.js";
import type {ParametersRecord} from "@rfc-inspector/common";

/**
 * Creates a classification for pure type labeling
 */
export function createClassification<
    TItem,
    TType = string,
    TContextParameters extends ParametersRecord = ParametersRecord
>(
    rule: RuleInterface<TItem, TType, TContextParameters>,
    index: number,
    score: number,
    length: number,
    result: RuleResult
): Classification<TItem, TType, TContextParameters> {
    return {
        index,
        length,
        rule,
        score,
        result
    };
}
