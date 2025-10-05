import {Token, TokenType} from "@rfc-inspector/tokenizer";

export function getScope(token: Token) {
    switch (token.type) {
        case TokenType.DATA_LINE:
            return 'rfc-data';
        case TokenType.FORM_FEED_LINE:
            return 'rfc-form-feed';
        case TokenType.BLANK_LINE:
            return 'rfc-blank-line';
        case TokenType.EOF:
            throw new Error('Unexpected EOF');
    }
}