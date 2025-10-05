import type {ContentLexeme} from "./ContentLexeme.js";
import {LexemeType} from "./LexemeType.js";

export interface NoteLexeme extends ContentLexeme {
    type: LexemeType.NOTE_LINE;
}