import type {RuleResult} from "@rfc-inspector/heuristic";
import {createRuleResult} from "@rfc-inspector/heuristic";
import {AbstractLexerRule} from "./AbstractLexerRule.js";
import type {LexerContext} from "../LexerContext.js";
import {LexemeType} from "../../Lexer/Lexeme/LexemeType.js";
import {isDataToken} from "../Utils/IsDataToken.js";
import {isBlankLineToken} from "../Utils/IsBlankLineToken.js";

function trimEnd<T>(items: T[], predicate: (item: T) => boolean) {
    let i = items.length - 1;

    while (i >= 0 && predicate(items[i])) {
        i--;
    }

    return items.slice(0, i + 1);
}

export class ListLineRule extends AbstractLexerRule {
    private static bulletExpression = /^\s*([-*+o])(\s+)\S/;
    private static decimalDotExpression = /^\s*(\d+\.)(\s+)\S/i;
    private static alphaDotExpression = /^\s*([a-z]\.)(\s+)\S/i;
    private static romanDotExpression = /^\s*([ivxlcdm]+\.)(\s+)\S/i;
    private static parentheticalExpression = /^\s*(\((?:\d+|[a-z]|[ivxlcdm]+)\))(\s+)\S/i;

    constructor() {
        super("rfc-list", LexemeType.LIST_LINE);
    }

    static matchList(data: string): RegExpMatchArray | null {
        let match: RegExpMatchArray | null = null;

        if ((match = data.match(ListLineRule.bulletExpression)) !== null) {
            return match;
        }

        if ((match = data.match(ListLineRule.decimalDotExpression)) !== null) {
            return match;
        }

        if ((match = data.match(ListLineRule.alphaDotExpression)) !== null) {
            return match;
        }

        if ((match = data.match(ListLineRule.romanDotExpression)) !== null) {
            return match;
        }

        if ((match = data.match(ListLineRule.parentheticalExpression)) !== null) {
            return match;
        }

        return null;
    }

    public match(context: LexerContext): RuleResult | false {
        const token = context.cursor.peek(0);

        if (!isDataToken(token)) {
            return false;
        }

        const match = ListLineRule.matchList(token.data);

        if (null === match) {
            return false;
        }

        context.cursor.skip();

        const marker = match[1];
        const spaces = match[2];
        const indent = token.indent + marker.length + spaces.length;
        let amount = 1; // the marker line

        // COLLECT EVERY LINE UNTIL the indent gets smaller
        const tokens = context.cursor.peekForwardUntil((token) => {
            if (isBlankLineToken(token)) {
                return false;
            }

            if (isDataToken(token)) {
                if (token.indent < indent) {
                    return true;
                }

                return false;
            }

            return true;
        });

        // trim blank lines from the end, as they are not part of the list
        const trimmed = trimEnd(tokens, (token) => isBlankLineToken(token));

        amount += trimmed.length;

        if (amount > 0) {
            return createRuleResult(amount, 80);
        }

        return false;
    }
}
