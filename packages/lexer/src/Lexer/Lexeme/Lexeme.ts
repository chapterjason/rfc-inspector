import type {EOFLexeme} from "./EOFLexeme.js";
import {LexemeLine} from "./LexemeLine";

export type Lexeme = LexemeLine | EOFLexeme;