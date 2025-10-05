import type {RuleResult} from "@rfc-inspector/heuristic";
import {createRuleResult} from "@rfc-inspector/heuristic";
import {AbstractLexerRule} from "./AbstractLexerRule.js";
import {isFormFeedToken} from "../Utils/IsFormFeedToken.js";
import type {LexerContext} from "../LexerContext.js";
import {LexemeType} from "../../Lexer/Lexeme/LexemeType.js";
import {isDataToken} from "../Utils/IsDataToken.js";

export class PageHeaderLineRule extends AbstractLexerRule {
    constructor() {
        super("rfc-page-header", LexemeType.PAGE_HEADER, true);
    }

    public match(context: LexerContext): RuleResult | false {
        const token = context.cursor.peek(0);

        if (!isDataToken(token)) {
            return false;
        }

        const previousToken = context.cursor.peek(-1);

        if (token.indent === 0 && isFormFeedToken(previousToken)) {
            return createRuleResult(1, 100);
        }

        return false;
    }
}
