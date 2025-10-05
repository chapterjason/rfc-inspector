import type {ContentLexeme} from "./ContentLexeme.js";
import {LexemeType} from "./LexemeType.js";

export interface FigureLexeme extends ContentLexeme {
    type: LexemeType.FIGURE_LINE;
}