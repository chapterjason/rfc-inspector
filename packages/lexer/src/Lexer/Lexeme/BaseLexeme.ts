import {LexemeType} from "./LexemeType.js";

export interface BaseLexeme {
    type: LexemeType;

    line: number;
    offset: number;
}

