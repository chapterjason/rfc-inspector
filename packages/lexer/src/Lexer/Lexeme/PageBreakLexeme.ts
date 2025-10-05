import {LexemeType} from "./LexemeType.js";
import type {BaseLexeme} from "./BaseLexeme.js";

export interface PageBreakLexeme extends BaseLexeme {
    type: LexemeType.PAGE_BREAK;
}