import {TokenType} from "./TokenType.js";
import type {BaseToken} from "./BaseToken.js";

export interface FormFeedLineToken extends BaseToken {
    type: TokenType.FORM_FEED_LINE;
}

