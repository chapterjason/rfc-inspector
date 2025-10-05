import type {ContentLexeme} from "./ContentLexeme.js";
import {LexemeType} from "./LexemeType.js";

export interface PageHeaderLexeme extends ContentLexeme {
    type: LexemeType.PAGE_HEADER;
}