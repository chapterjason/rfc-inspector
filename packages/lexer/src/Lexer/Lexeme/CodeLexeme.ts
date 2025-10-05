import type {ContentLexeme} from "./ContentLexeme.js";
import {LexemeType} from "./LexemeType.js";

export interface CodeLexeme extends ContentLexeme {
    type: LexemeType.CODE_LINE;
}