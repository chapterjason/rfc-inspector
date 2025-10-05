import type {ContentLexeme} from "./ContentLexeme.js";
import {LexemeType} from "./LexemeType.js";

export interface TableLexeme extends ContentLexeme {
    type: LexemeType.TABLE_LINE;
}