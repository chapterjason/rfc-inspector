import type {ContentLexeme} from "./ContentLexeme.js";
import {LexemeType} from "./LexemeType.js";

export interface CaptionLexeme extends ContentLexeme {
    type: LexemeType.CAPTION_LINE;
}