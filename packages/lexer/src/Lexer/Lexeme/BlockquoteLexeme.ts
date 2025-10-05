import type {ContentLexeme} from "./ContentLexeme.js";
import {LexemeType} from "./LexemeType.js";

export interface BlockquoteLexeme extends ContentLexeme {
    type: LexemeType.BLOCKQUOTE_LINE;
}