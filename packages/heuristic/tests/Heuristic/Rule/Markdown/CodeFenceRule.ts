import type {Context} from "../../../../src/Heuristic/Context/Context.js";
import type {RuleResult} from "../../../../src/Heuristic/Rule/RuleResult.js";
import {BaseMarkdownRule} from "./BaseMarkdownRule.js";

export class CodeFenceRule extends BaseMarkdownRule {
    private readonly maxLookahead: number;

    constructor(maxLookahead = 20) {
        super("markdown-code-fence", "CODE_FENCE", true);
        this.maxLookahead = maxLookahead;
    }

    protected performMatch(context: Context<string>): RuleResult | false {
        const currentLine = context.cursor.peek();

        if (typeof currentLine !== "string" || !currentLine.startsWith("```")) {
            return false;
        }

        const closing = context.getNextMatchingItem(this.maxLookahead, (item) => {
            return typeof item === "string" && item.startsWith("```");
        });

        const startIndex = context.cursor.getIndex();
        const length = closing ? closing.index - startIndex + 1 : 1;
        const score = 120 + (closing ? 10 : -20);

        return {
            length,
            score,
        };
    }
}
