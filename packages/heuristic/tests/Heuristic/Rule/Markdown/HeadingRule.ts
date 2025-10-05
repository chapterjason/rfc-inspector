import type {Context} from "../../../../src/Heuristic/Context/Context.js";
import type {RuleResult} from "../../../../src/Heuristic/Rule/RuleResult.js";
import {BaseMarkdownRule} from "./BaseMarkdownRule.js";

export class HeadingRule extends BaseMarkdownRule {
    constructor() {
        super("markdown-heading", "HEADING");
    }

    protected performMatch(context: Context<string>): RuleResult | false {
        const line = context.cursor.peek();

        if (typeof line !== "string") {
            return false;
        }

        const match = line.match(/^(?<hashes>#{1,6})\s+.+/u);
        if (!match || !match.groups) {
            return false;
        }

        const depth = match.groups.hashes.length;
        const score = 150 - depth * 10;

        return {
            length: 1,
            score,
        };
    }
}
