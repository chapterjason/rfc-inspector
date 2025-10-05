import type {RuleResult} from "@rfc-inspector/heuristic";
import {createRuleResult} from "@rfc-inspector/heuristic";
import {AbstractLexerRule} from "./AbstractLexerRule.js";
import type {LexerContext} from "../LexerContext.js";
import {countDataLines} from "../Utils/CountDataLines.js";
import {LexemeType} from "../../Lexer/Lexeme/LexemeType.js";
import type {LexerClassification} from "../LexerClassification.js";

export class TitleLineRule extends AbstractLexerRule {
    constructor() {
        super("rfc-title", LexemeType.TITLE_LINE, true);
    }

    public match(context: LexerContext): RuleResult | false {
        if (false === context.parameters.get("hasMetadata")) {
            return false;
        }

        if (true === context.parameters.get("hasTitle")) {
            return false;
        }

        return createRuleResult(countDataLines(context), 100);
    }

    public onAccept(context: LexerContext, _classification: LexerClassification): void {
        context.parameters.set("hasTitle", true);
    }
}
