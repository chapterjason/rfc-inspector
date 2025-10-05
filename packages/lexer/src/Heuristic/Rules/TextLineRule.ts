import type {RuleResult} from "@rfc-inspector/heuristic";
import {createRuleResult} from "@rfc-inspector/heuristic";
import {TokenType} from "@rfc-inspector/tokenizer";
import {AbstractLexerRule} from "./AbstractLexerRule.js";
import type {LexerContext} from "../LexerContext.js";
import {LexemeType} from "../../Lexer/Lexeme/LexemeType.js";

export class TextLineRule extends AbstractLexerRule {
    constructor() {
        super("rfc-text", LexemeType.TEXT_LINE);
    }

    public match(context: LexerContext): RuleResult | false {
        const token = context.cursor.peek(0);

        if (!token) {
            return false;
        }

        if (token.type === TokenType.DATA_LINE) {
            // Only a small score as every more specific rule should be considered instead
            return createRuleResult(1, 10);
        }

        return false;
    }
}
