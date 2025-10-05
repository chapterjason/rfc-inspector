import type {ContentLexeme} from "./ContentLexeme.js";
import {LexemeType} from "./LexemeType.js";

export interface TextLexeme extends ContentLexeme {
    type: LexemeType.TEXT_LINE;
}