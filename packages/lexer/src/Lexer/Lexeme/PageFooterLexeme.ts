import type {ContentLexeme} from "./ContentLexeme.js";
import {LexemeType} from "./LexemeType.js";

export interface PageFooterLexeme extends ContentLexeme {
    type: LexemeType.PAGE_FOOTER;
}