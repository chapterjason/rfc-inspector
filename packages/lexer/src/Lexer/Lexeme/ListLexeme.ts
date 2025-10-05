import type {ContentLexeme} from "./ContentLexeme.js";
import {LexemeType} from "./LexemeType.js";

export interface ListLexeme extends ContentLexeme {
    type: LexemeType.LIST_LINE;
}