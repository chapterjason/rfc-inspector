import type {RuleResult} from "@rfc-inspector/heuristic";
import {createRuleResult} from "@rfc-inspector/heuristic";
import {AbstractLexerRule} from "./AbstractLexerRule.js";
import type {LexerContext} from "../LexerContext.js";
import {LexemeType} from "../../Lexer/Lexeme/LexemeType.js";
import {countDataLines} from "../Utils/CountDataLines.js";
import type {LexerClassification} from "../LexerClassification.js";

export class FrontPageHeaderLine extends AbstractLexerRule {
    constructor() {
        super("rfc-front-page-header", LexemeType.FRONT_PAGE_HEADER_LINE, true);
    }

    public match(context: LexerContext): RuleResult | false {
        if (true === context.parameters.get("hasMetadata")) {
            return false;
        }

        return createRuleResult(countDataLines(context), 100);
    }

    public onAccept(context: LexerContext, _classification: LexerClassification): void {
        context.parameters.set("hasMetadata", true);
    }
}
