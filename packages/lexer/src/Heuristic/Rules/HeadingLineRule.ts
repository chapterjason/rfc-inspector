import {createRuleResult, type RuleResult} from "@rfc-inspector/heuristic";
import {AbstractLexerRule} from "./AbstractLexerRule.js";
import type {LexerContext} from "../LexerContext.js";
import {LexemeType} from "../../Lexer/Lexeme/LexemeType.js";
import {isDataToken} from "../Utils/IsDataToken.js";
import {countDataLines} from "../Utils/CountDataLines.js";
import type {LexerClassification} from "../LexerClassification.js";

export class HeadingLineRule extends AbstractLexerRule {
    constructor() {
        super("rfc-heading", LexemeType.HEADING_LINE);
    }

    public match(context: LexerContext): RuleResult | false {
        const token = context.cursor.peek(0);

        if (!isDataToken(token)) {
            return false;
        }

        if (token.indent === 0) {
            return createRuleResult(countDataLines(context), 100);
        }

        return false;
    }

    onAccept(context: LexerContext, _classification: LexerClassification) {
        const token = context.cursor.peek(0);

        if (isDataToken(token)) {
            if (token.data.toLowerCase().includes('table of contents')) {
                context.parameters.set('isInTableOfContents', true);
            } else {
                context.parameters.set('isInTableOfContents', false);
            }
        }
    }
}
