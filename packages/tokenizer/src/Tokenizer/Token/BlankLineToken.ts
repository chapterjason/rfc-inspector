import {TokenType} from "./TokenType.js";
import type {BaseToken} from "./BaseToken.js";

export interface BlankLineToken extends BaseToken {
    type: TokenType.BLANK_LINE;
}