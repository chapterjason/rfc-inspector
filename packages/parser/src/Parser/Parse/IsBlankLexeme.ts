import {type BlankLexeme, type Lexeme, LexemeType} from "@rfc-inspector/lexer";

export function isBlankLexeme(lexeme: Lexeme): lexeme is BlankLexeme {
    return lexeme.type === LexemeType.BLANK;
}