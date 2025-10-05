import {createRuleResult, type RuleResult} from "@rfc-inspector/heuristic";
import {AbstractLexerRule} from "./AbstractLexerRule.js";
import type {LexerContext} from "../LexerContext.js";
import {LexemeType} from "../../Lexer/Lexeme/LexemeType.js";
import {isDataToken} from "../Utils/IsDataToken.js";

export class TableOfContentsLineRule extends AbstractLexerRule {
    constructor() {
        super("rfc-toc", LexemeType.TOC_LINE);
    }

    public match(context: LexerContext): RuleResult | false {
        const token = context.cursor.peek(0);

        if (!token) {
            return false;
        }

        if (false === context.parameters.get("isInTableOfContents")) {
            return false;
        }

        // read all lines until indent is 0 again
        const count = context.countUntil((token) => {
            if (isDataToken(token)) {
                return token.indent === 0;
            }

            return false;
        });

        return createRuleResult(count, 80);
    }
}
