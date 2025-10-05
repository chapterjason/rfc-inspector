import {Analyzer, createAnalyzer} from "@rfc-inspector/heuristic";
import {createLexerHeuristicSpecification} from "./CreateLexerHeuristicSpecification.js";
import type {LexerParametersRecord} from "../LexerParametersRecord.js";
import type {LexerClassification} from "../LexerClassification.js";
import type {Token} from "@rfc-inspector/tokenizer";
import type {LexemeType} from "../../Lexer/Lexeme/LexemeType.js";

export function createLexerHeuristicAnalyzer(): Analyzer<Token, LexemeType, LexerParametersRecord> {
    const specification = createLexerHeuristicSpecification();

    return createAnalyzer<Token, LexemeType, LexerParametersRecord>(specification, {
        scoringFunction: (_rule, matchScore): number => {
            return matchScore;
        },
        overlapResolver: (current, incoming): LexerClassification => {
            if (!current) {
                return incoming;
            }

            return current.score >= incoming.score ? current : incoming;
        }
    });
}
