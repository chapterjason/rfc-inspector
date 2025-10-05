import type {RuleResult} from "@rfc-inspector/heuristic";
import {createRuleResult} from "@rfc-inspector/heuristic";
import {AbstractLexerRule} from "./AbstractLexerRule.js";
import type {LexerContext} from "../LexerContext.js";
import {LexemeType} from "../../Lexer/Lexeme/LexemeType.js";
import {isEOFToken} from "../Utils/IsEOFToken.js";

export class EOFLineRule extends AbstractLexerRule {
    constructor() {
        super("rfc-eof", LexemeType.EOF, true);
    }

    public match(context: LexerContext): RuleResult | false {
        const token = context.cursor.peek(0);

        if (isEOFToken(token)) {
            return createRuleResult(1, 100);
        }

        return false;
    }
}
