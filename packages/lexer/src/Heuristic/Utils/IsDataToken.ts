import {type DataLineToken, type Token, TokenType} from "@rfc-inspector/tokenizer";

export function isDataToken(token: Token | undefined): token is DataLineToken {
    if (undefined === token) {
        return false;
    }

    return token.type === TokenType.DATA_LINE;
}