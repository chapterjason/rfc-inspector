import type {RuleResult} from "../RuleResult.js";

/**
 * Creates a match result for pure type labeling
 */
export function createRuleResult(
    length = 1,
    score = 100
): RuleResult {
    return {
        length,
        score,
    };
}
