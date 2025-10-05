import type {ContentLexeme} from "./ContentLexeme.js";
import {LexemeType} from "./LexemeType.js";

export interface FrontPageHeaderLexeme extends ContentLexeme {
    type: LexemeType.FRONT_PAGE_HEADER_LINE;
}