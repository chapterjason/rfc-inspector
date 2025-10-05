import {LexemeType} from "./LexemeType.js";
import type {BaseLexeme} from "./BaseLexeme.js";

export interface BlankLexeme extends BaseLexeme {
    type: LexemeType.BLANK;
}