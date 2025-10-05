import {TokenType} from "./TokenType.js";
import type {BaseToken} from "./BaseToken.js";

export interface DataLineToken extends BaseToken {
    type: TokenType.DATA_LINE;

    /**
     * Indention level of the line.
     */
    indent: number;

    /**
     * Content of the line without leading whitespace.
     */
    data: string;
}