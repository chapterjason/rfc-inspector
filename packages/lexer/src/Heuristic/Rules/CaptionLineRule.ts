import {createRuleResult, type RuleResult} from "@rfc-inspector/heuristic";
import {AbstractLexerRule} from "./AbstractLexerRule.js";
import type {LexerContext} from "../LexerContext.js";
import {LexemeType} from "../../Lexer/Lexeme/LexemeType.js";
import {isDataToken} from "../Utils/IsDataToken.js";
import {countDataLines} from "../Utils/CountDataLines.js";
import {isBlankLineToken} from "../Utils/IsBlankLineToken.js";

export class CaptionLineRule extends AbstractLexerRule {
    static expression = /(Figure|Table) \d+:/i

    constructor() {
        super("rfc-caption", LexemeType.CAPTION_LINE);
    }

    public match(context: LexerContext): RuleResult | false {
        const token = context.cursor.peek(0);

        if (!isDataToken(token)){
            return false;
        }

        if (CaptionLineRule.expression.test(token.data)) {
            let score = 20;

            const previousToken = context.cursor.peek(-1);

            if (isBlankLineToken(previousToken)){
                score += 40;
            }

            const amount = countDataLines(context);

            const nextToken = context.cursor.peek();

            if (isBlankLineToken(nextToken)){
                score += 40;
            }

            return createRuleResult(amount, score);
        }

        return false;
    }
}
