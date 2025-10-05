import type {Context} from "../../../../src/Heuristic/Context/Context.js";
import type {RuleResult} from "../../../../src/Heuristic/Rule/RuleResult.js";
import {BaseMarkdownRule} from "./BaseMarkdownRule.js";
import {createRuleResult} from "../../../../src/index.js";

function getIndentation(line: string): number {
    return line.length - line.trimStart().length;
}

export class ListItemRule extends BaseMarkdownRule {
    private static bulletExpression = /^\s*([-*+])(\s+)\S+/;

    constructor() {
        super("markdown-list-item", "LIST_ITEM");
    }

    protected performMatch(context: Context<string>): RuleResult | false {
        const line = context.cursor.peek();

        if (typeof line !== "string") {
            return false;
        }

        const match = line.match(ListItemRule.bulletExpression);

        if (!match) {
            return false;
        }

        context.cursor.skip();

        let amount = 1;

        const marker = match[1];
        const spaces = match[2];
        const indent = getIndentation(line) + marker.length + spaces.length;

        const lines = context.cursor.peekForwardUntil((line) => {
            const currentIndent = getIndentation(line);

            if (currentIndent >= indent) {
                return false;
            }

            return true;
        });

        amount += lines.length;

        return createRuleResult(amount, 100);
    }
}
