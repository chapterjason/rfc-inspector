import {Token, TokenType} from "@rfc-inspector/tokenizer";
import {normalizeType} from "./NormalizeType.js";

import {hasTypeProperty} from "./HasTypeProperty.js";

export function getTokenType(token: Token | TokenType): string {
    if (hasTypeProperty(token)) {
        return getTokenType(token.type);
    }

    return 'rfc-token-' + normalizeType(TokenType[token]);
}