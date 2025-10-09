import {Lexeme, LexemeType} from "@rfc-inspector/lexer";
import {normalizeType} from "./NormalizeType.js";
import {hasTypeProperty} from "./HasTypeProperty.js";

export function getLexemeType(lexeme: Lexeme | LexemeType): string {
    if (hasTypeProperty(lexeme)) {
        return getLexemeType(lexeme.type);
    }

    return 'rfc-lexeme-' + normalizeType(LexemeType[lexeme]);
}