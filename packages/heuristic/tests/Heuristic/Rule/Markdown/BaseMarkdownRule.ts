import {AbstractRule} from "../../../../src/Heuristic/Rule/AbstractRule.js";
import type {Context} from "../../../../src/Heuristic/Context/Context.js";
import type {RuleResult} from "../../../../src/Heuristic/Rule/RuleResult.js";
import type {Classification} from "../../../../src/index.js";

/**
 * Base helper for markdown-oriented test rules providing invocation counters.
 */
export abstract class BaseMarkdownRule extends AbstractRule<string> {
    public matchInvocations = 0;
    public acceptInvocations = 0;

    protected constructor(
        rule: string,
        type: string,
        stopWhenMatched = false
    ) {
        super(rule, type, stopWhenMatched);
    }

    match(context: Context<string>): RuleResult | false {
        this.matchInvocations += 1;
        return this.performMatch(context);
    }

    onAccept(context: Context<string>, classification: Classification<string>): void {
        this.acceptInvocations += 1;
        super.onAccept(context, classification);
    }

    protected abstract performMatch(context: Context<string>): RuleResult | false;
}
