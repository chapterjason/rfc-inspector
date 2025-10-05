import {AbstractRule} from "@rfc-inspector/heuristic";
import type {LexerParametersRecord} from "../LexerParametersRecord.js";
import type {Token} from "@rfc-inspector/tokenizer";
import type {LexemeType} from "../../Lexer/Lexeme/LexemeType.js";

/**
 * Base class for lexer heuristic rules bound to token line inputs.
 */
export abstract class AbstractLexerRule extends AbstractRule<Token, LexemeType, LexerParametersRecord> {
    protected constructor(rule: string, type: LexemeType, stopWhenMatched = false) {
        super(rule, type, stopWhenMatched);
    }
}
