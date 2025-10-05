import {type BlankLineToken, type Token, TokenType} from "@rfc-inspector/tokenizer";

export function isBlankLineToken(token: Token | undefined): token is BlankLineToken {
    if (undefined === token) {
        return false;
    }

    return token.type === TokenType.BLANK_LINE;
}