import {createRuleResult, type RuleResult} from "@rfc-inspector/heuristic";
import {AbstractLexerRule} from "./AbstractLexerRule.js";
import type {LexerContext} from "../LexerContext.js";
import {isBlankLineToken} from "../Utils/IsBlankLineToken.js";
import {isDataToken} from "../Utils/IsDataToken.js";
import {LexemeType} from "../../Lexer/Lexeme/LexemeType.js";

/**
 * Figure includes:
 * - Graph
 * - Packet Diagram
 */
export class FigureLineRule extends AbstractLexerRule {
    private static figureSeparatorExpression = /^\+[-~+=| ]+\+$/;

    constructor() {
        super("rfc-figure", LexemeType.FIGURE_LINE, true);
    }

    public match(context: LexerContext): RuleResult | false {
        const token = context.cursor.peek(0);

        if (!isDataToken(token)) {
            return false;
        }

        if (FigureLineRule.figureSeparatorExpression.test(token.data)) {
            const amount = context.countUntil((line) => {
                // @todo As the content for some graphs are pretty versatile we match until a new blank line for now
                return isBlankLineToken(line);
            });

            return createRuleResult(amount, 100);
        }

        const tokens = [];
        while (context.cursor.hasNext()) {
            const token = context.cursor.next();

            if (isDataToken(token)) {
                tokens.push(token);
            } else {
                break;
            }
        }

        if (tokens.some(token => {
            if (isDataToken(token)) {
                return FigureLineRule.figureSeparatorExpression.test(token.data);
            }

            return false;
        })) {
            const amount = context.countUntil((line) => {
                return isBlankLineToken(line);
            });

            return createRuleResult(amount, 100);
        }

        return false;
    }
}
