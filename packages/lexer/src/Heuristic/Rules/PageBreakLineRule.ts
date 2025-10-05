import type {RuleResult} from "@rfc-inspector/heuristic";
import {createRuleResult} from "@rfc-inspector/heuristic";
import {AbstractLexerRule} from "./AbstractLexerRule.js";
import {isFormFeedToken} from "../Utils/IsFormFeedToken.js";
import type {LexerContext} from "../LexerContext.js";
import {LexemeType} from "../../Lexer/Lexeme/LexemeType.js";

export class PageBreakLineRule extends AbstractLexerRule {
    constructor() {
        super("rfc-page-break", LexemeType.PAGE_BREAK, true);
    }

    public match(context: LexerContext): RuleResult | false {
        const token = context.cursor.peek(0);

        if (undefined === token) {
            return false;
        }

        if (isFormFeedToken(token)) {
            return createRuleResult(1, 100);
        }

        return false;
    }
}
