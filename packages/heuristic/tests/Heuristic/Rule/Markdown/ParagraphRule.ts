import type {Context} from "../../../../src/Heuristic/Context/Context.js";
import type {RuleResult} from "../../../../src/Heuristic/Rule/RuleResult.js";
import {BaseMarkdownRule} from "./BaseMarkdownRule.js";

export class ParagraphRule extends BaseMarkdownRule {
    constructor() {
        super("markdown-paragraph", "PARAGRAPH");
    }

    protected performMatch(context: Context<string>): RuleResult | false {
        const line = context.cursor.peek();

        if (typeof line !== "string") {
            return false;
        }

        const trimmed = line.trim();
        if (trimmed.length === 0) {
            return false;
        }

        const score = 40 + Math.min(trimmed.length, 40);
        return {
            length: 1,
            score,
        };
    }
}
