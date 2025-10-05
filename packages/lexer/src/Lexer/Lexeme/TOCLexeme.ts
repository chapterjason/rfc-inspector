import type {ContentLexeme} from "./ContentLexeme.js";
import {LexemeType} from "./LexemeType.js";

export interface TOCLexeme extends ContentLexeme {
    type: LexemeType.TOC_LINE;
}