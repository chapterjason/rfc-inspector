import type {RuleResult} from "./RuleResult.js";
import type {Context} from "../Context/Context.js";
import type {Parameters, ParametersRecord} from "@rfc-inspector/common";
import type {Classification} from "../Classification.js";

/**
 * Interface that all heuristic rules must implement
 */
export interface RuleInterface<
    TItem,
    TType = string,
    TContextParameters extends ParametersRecord = ParametersRecord
> {
    /**
     * A unique identifier for the rule
     */
    readonly name: string;

    /**
     * The classification type that this rule matches
     */
    readonly type: TType;

    /**
     * Preempt further rule checks on this anchor
     */
    readonly stopWhenMatched: boolean;

    /**
     * Attempt to match the current context
     * @param context The context to match against
     * @returns MatchResult if matched, false if not matched
     */
    match(context: Context<TItem, TType, TContextParameters>): RuleResult | false;

    /**
     * Called when this rule wins the classification
     * Override this method to perform additional actions when the rule is accepted
     * @param context The context in which the rule was accepted
     * @param classification The classification that was accepted by this rule
     */
    onAccept(context: Context<TItem, TType, TContextParameters>, classification: Classification<TItem, TType, TContextParameters>): void;
}