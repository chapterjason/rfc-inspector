import {type FormFeedLineToken, type Token, TokenType} from "@rfc-inspector/tokenizer";

export function isFormFeedToken(token?: Token): token is FormFeedLineToken {
    if (token === undefined) {
        return false;
    }

    return token.type === TokenType.FORM_FEED_LINE;
}