import {createRuleResult, type RuleResult} from "@rfc-inspector/heuristic";
import {AbstractLexerRule} from "./AbstractLexerRule.js";
import type {LexerContext} from "../LexerContext.js";
import {LexemeType} from "../../Lexer/Lexeme/LexemeType.js";
import {isDataToken} from "../Utils/IsDataToken.js";

export class TableLineRule extends AbstractLexerRule {
    private static tableSeparatorExpression = /\+[+-]+\+/;

    constructor() {
        super("rfc-table", LexemeType.TABLE_LINE, true);
    }

    public match(context: LexerContext): RuleResult | false {
        const token = context.cursor.peek(0);

        if (!isDataToken(token)){
            return false;
        }

        if (TableLineRule.tableSeparatorExpression.test(token.data)) {
            const length = token.data.length;
            const indent = token.indent;

            // collect each line until blank line
            const tokens = context.cursor.peekForwardUntil((token) => !isDataToken(token));

            for (let index = 0; index < tokens.length; index++){
                const token = tokens[index];

                if (!isDataToken(token)){
                    return false;
                }

                if (token.indent !== indent) {
                    return false;
                }

                if (token.data.length !== length) {
                    return false;
                }

                if (index === tokens.length - 1) {
                    // last table line should match it
                    // @todo validate, I hope this is the case for most of all the tables, who knows :)
                    if (!TableLineRule.tableSeparatorExpression.test(token.data)) {
                        return false;
                    }
                }
            }

            return createRuleResult(tokens.length, 100);
        }

        return false;
    }
}
