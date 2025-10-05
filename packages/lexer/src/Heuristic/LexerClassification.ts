import type {Classification} from "@rfc-inspector/heuristic";
import type {LexerParametersRecord} from "./LexerParametersRecord.js";
import type {Token} from "@rfc-inspector/tokenizer";
import type {LexemeType} from "../Lexer/Lexeme/LexemeType.js";

export type LexerClassification = Classification<Token, LexemeType, LexerParametersRecord>;