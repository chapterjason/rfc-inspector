import {Token, TokenType} from "@rfc-inspector/tokenizer";

export function getTokenScope(token: Token) {
    if (token.type === TokenType.EOF) {
        throw new Error('Unexpected EOF');
    }

    return 'rfc-' + TokenType[token.type].toLowerCase().replace('_', '-');
}

