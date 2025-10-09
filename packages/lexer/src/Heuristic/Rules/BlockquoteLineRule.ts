import {createRuleResult, type RuleResult} from "@rfc-inspector/heuristic";
import {AbstractLexerRule} from "./AbstractLexerRule.js";
import type {LexerContext} from "../LexerContext.js";
import {LexemeType} from "../../Lexer/Lexeme/LexemeType.js";
import {isDataToken} from "../Utils/IsDataToken.js";
import {Token} from "@rfc-inspector/tokenizer";

export class BlockquoteLineRule extends AbstractLexerRule {
    private static expression = /^[>|][ ]{1,}.*$/;

    constructor() {
        super("rfc-block-quote", LexemeType.BLOCKQUOTE_LINE, true);
    }

    private isBlockQuoteLine(token: Token): boolean {
        if (!isDataToken(token)){
            return false;
        }

        return BlockquoteLineRule.expression.test(token.data);
    }

    public match(context: LexerContext): RuleResult | false {
        const token = context.cursor.peek(0);

        if (!isDataToken(token)){
            return false;
        }

        if (!this.isBlockQuoteLine(token)) {
            return false;
        }

        const tokens = context.cursor.peekForwardUntil((t) => !this.isBlockQuoteLine(t));

        return createRuleResult(tokens.length, 100);
    }
}
