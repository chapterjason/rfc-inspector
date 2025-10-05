import type {RuleInterface} from "./RuleInterface.js";
import type {RuleResult} from "./RuleResult.js";
import type {Context} from "../Context/Context.js";
import type {Parameters, ParametersRecord} from "@rfc-inspector/common";
import type {Classification} from "../Classification.js";

/**
 * Abstract base class for heuristic rules that provides default implementation
 */
export abstract class AbstractRule<
    TItem,
    TType = string,
    TContextParameters extends ParametersRecord = ParametersRecord
> implements RuleInterface<TItem, TType, TContextParameters> {
    public readonly name: string;
    public readonly type: TType;
    public readonly stopWhenMatched: boolean;

    constructor(
        rule: string,
        type: TType,
        stopWhenMatched = false
    ) {
        this.name = rule;
        this.type = type;
        this.stopWhenMatched = stopWhenMatched;
    }

    /**
     * Must be implemented by concrete rule classes
     */
    public abstract match(context: Context<TItem, TType, TContextParameters>): RuleResult | false;

    /**
     * Default implementation does nothing - override to add custom behavior
     */
    public onAccept(_context: Context<TItem, TType, TContextParameters>, _classification: Classification<TItem, TType, TContextParameters>): void {
        // Default implementation - do nothing
        // Subclasses can override this to add custom behavior when the rule is accepted
    }
}