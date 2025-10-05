import type {Context} from "@rfc-inspector/heuristic";
import type {LexerParametersRecord} from "./LexerParametersRecord.js";
import type {Token} from "@rfc-inspector/tokenizer";
import type {LexemeType} from "../Lexer/Lexeme/LexemeType.js";

export type LexerContext = Context<Token, LexemeType, LexerParametersRecord>;