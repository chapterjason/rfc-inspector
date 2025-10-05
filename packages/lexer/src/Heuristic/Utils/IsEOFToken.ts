import {type EOFToken, type Token, TokenType} from "@rfc-inspector/tokenizer";

export function isEOFToken(token: Token | undefined): token is EOFToken {
    if (undefined === token) {
        return false;
    }

    return token.type === TokenType.EOF;
}