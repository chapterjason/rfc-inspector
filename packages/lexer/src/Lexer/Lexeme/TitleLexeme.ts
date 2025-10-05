import type {ContentLexeme} from "./ContentLexeme.js";
import {LexemeType} from "./LexemeType.js";

export interface TitleLexeme extends ContentLexeme {
    type: LexemeType.TITLE_LINE;
}