import type {RuleResult} from "@rfc-inspector/heuristic";
import {createRuleResult} from "@rfc-inspector/heuristic";
import {AbstractLexerRule} from "./AbstractLexerRule.js";
import type {LexerContext} from "../LexerContext.js";
import {isBlankLineToken} from "../Utils/IsBlankLineToken.js";
import {LexemeType} from "../../Lexer/Lexeme/LexemeType.js";

export class BlankLineRule extends AbstractLexerRule {
    constructor() {
        super("rfc-blank-line", LexemeType.BLANK, true);
    }

    public match(context: LexerContext): RuleResult | false {
        const token = context.cursor.peek(0);

        if (isBlankLineToken(token)) {
            return createRuleResult(1, 100);
        }

        return false;
    }
}
