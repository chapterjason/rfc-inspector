import type {RuleResult} from "@rfc-inspector/heuristic";
import {createRuleResult} from "@rfc-inspector/heuristic";
import {AbstractLexerRule} from "./AbstractLexerRule.js";
import {isFormFeedToken} from "../Utils/IsFormFeedToken.js";
import type {LexerContext} from "../LexerContext.js";
import {isDataToken} from "../Utils/IsDataToken.js";
import {LexemeType} from "../../Lexer/Lexeme/LexemeType.js";

export class PageFooterLineRule extends AbstractLexerRule {
    constructor() {
        super("rfc-page-footer", LexemeType.PAGE_FOOTER, true);
    }

    public match(context: LexerContext): RuleResult | false {
        const token = context.cursor.peek(0);

        if (!isDataToken(token)) {
            return false;
        }

        const nextToken = context.cursor.peek(1);

        if (token.indent === 0 && isFormFeedToken(nextToken)) {
            return createRuleResult(1, 100);
        }

        return false;
    }
}
