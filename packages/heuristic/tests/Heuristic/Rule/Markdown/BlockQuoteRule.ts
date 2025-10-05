import type {Context} from "../../../../src/Heuristic/Context/Context.js";
import type {RuleResult} from "../../../../src/Heuristic/Rule/RuleResult.js";
import {BaseMarkdownRule} from "./BaseMarkdownRule.js";

export class BlockQuoteRule extends BaseMarkdownRule {
    constructor() {
        super("markdown-block-quote", "BLOCK_QUOTE");
    }

    protected performMatch(context: Context<string>): RuleResult | false {
        const line = context.cursor.peek();

        if (typeof line !== "string") {
            return false;
        }

        const match = line.match(/^\s{0,3}>\s*.*/u);

        if (!match) {
            return false;
        }

        let length = 1;
        const maxLookahead = 50;

        for (let step = 1; step <= maxLookahead; step += 1) {
            const nextLine = context.cursor.peek(step);

            if (undefined === nextLine) {
                break;
            }

            if (nextLine.match(/^\s{0,3}>\s*.*/u)) {
                length += 1;
            } else {
                break;
            }
        }

        const score = 100;

        return {
            length,
            score,
        };
    }
}
