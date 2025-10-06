import {Lexeme, LexemeType} from "@rfc-inspector/lexer";

export function getLexemeScope(lexeme: Lexeme) {
    if (lexeme.type === LexemeType.EOF) {
        throw new Error('Unexpected EOF');
    }

    return 'rfc-' + LexemeType[lexeme.type].toLowerCase().replace('_', '-');
}