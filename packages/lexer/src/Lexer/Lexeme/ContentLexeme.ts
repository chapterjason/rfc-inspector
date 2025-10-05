import type {BaseLexeme} from "./BaseLexeme.js";

export interface ContentLexeme extends BaseLexeme {
    indent: number;
    text: string;
}