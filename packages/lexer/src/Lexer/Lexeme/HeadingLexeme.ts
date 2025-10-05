import type {ContentLexeme} from "./ContentLexeme.js";
import {LexemeType} from "./LexemeType.js";

export interface HeadingLexeme extends ContentLexeme {
    type: LexemeType.HEADING_LINE;
}