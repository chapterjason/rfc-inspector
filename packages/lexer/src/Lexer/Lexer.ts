import {type Token, TokenType} from "@rfc-inspector/tokenizer";
import type {Analyzer} from "@rfc-inspector/heuristic";
import {ArrayCursor} from "@rfc-inspector/common";
import {createLexerHeuristicAnalyzer} from "../Heuristic/Factory/CreateLexerHeuristicAnalyzer.js";
import type {LexerParametersRecord} from "../Heuristic/LexerParametersRecord.js";
import type {LexerClassification} from "../Heuristic/LexerClassification.js";
import {LexemeType} from "./Lexeme/LexemeType.js";
import type {Lexeme} from "./Lexeme/Lexeme.js";
import type {BlankLexeme} from "./Lexeme/BlankLexeme.js";
import type {EOFLexeme} from "./Lexeme/EOFLexeme.js";
import type {TextLexeme} from "./Lexeme/TextLexeme.js";
import type {PageBreakLexeme} from "./Lexeme/PageBreakLexeme.js";

export class Lexer {
    private readonly heuristicAnalyzer: Analyzer<Token, LexemeType, LexerParametersRecord>;

    constructor() {
        this.heuristicAnalyzer = createLexerHeuristicAnalyzer();
    }

    lex(tokens: Token[]): Lexeme[] {
        const classifications = this.classifyTokens(tokens);

        // Convert classifications to line objects
        return this.convertTokensToLexemes(tokens, classifications);
    }

    /**
     * Classifies lines using the heuristic analyzer
     */
    private classifyTokens(tokens: Token[]): LexerClassification[] {
        const cursor = new ArrayCursor(tokens);

        return this.heuristicAnalyzer.analyzeCursor(cursor);
    }

    private convertTokensToLexemes(
        tokens: Token[],
        classifications: LexerClassification[]
    ): Lexeme[] {
        const lexemes: Lexeme[] = [];
        const tokenToClassification = new Map<number, LexerClassification>();

        for (const classification of classifications) {
            for (let index = classification.index; index < classification.index + classification.length; index++) {
                const existing = tokenToClassification.get(index);
                
                if (!existing) {
                    tokenToClassification.set(index, classification);
                    continue;
                }
                
                if (classification.score > existing.score) {
                    tokenToClassification.set(index, classification);
                    continue;
                }
                
                if (classification.score < existing.score) {
                    continue;
                }
                
                if (classification.rule.stopWhenMatched && !existing.rule.stopWhenMatched) {
                    tokenToClassification.set(index, classification);
                    continue;
                }
                
                if (!classification.rule.stopWhenMatched && existing.rule.stopWhenMatched) {
                    continue;
                }
                
                if (classification.index > existing.index) {
                    tokenToClassification.set(index, classification);
                }
            }
        }

        for (let index = 0; index < tokens.length; index++) {
            const token = tokens[index];
            const classification = tokenToClassification.get(index);

            if (!token) {
                throw new Error(`Token at index ${index} not found`);
            }

            if (!classification) {
                throw new Error(`No classification found for token at index ${index}`);
            }

            lexemes.push(this.createLineFromClassification(token, classification.rule.type));
        }

        return lexemes;
    }

    /**
     * Factory method to create the appropriate line type based on classification
     */
    private createLineFromClassification(token: Token, type: LexemeType): Lexeme {
        if (token.type === TokenType.EOF) {
            if (type === LexemeType.EOF) {
                return {type: LexemeType.EOF} as EOFLexeme;
            }

            throw new Error(`Token ${TokenType[token.type]} MUST be classified as EOF. Classified as ${LexemeType[type]} instead.`);
        }

        const base = {
            line: token.line,
            offset: token.offset,
        };

        switch (token.type) {
            case TokenType.BLANK_LINE:
                return {type: LexemeType.BLANK, ...base} as BlankLexeme;
            case TokenType.FORM_FEED_LINE:
                return {type: LexemeType.PAGE_BREAK, ...base} as PageBreakLexeme;
            case TokenType.DATA_LINE:
            default:
                switch (type) {
                    case LexemeType.BLANK:
                    case LexemeType.PAGE_BREAK:
                        return {type, ...base} as PageBreakLexeme;
                    case LexemeType.FRONT_PAGE_HEADER_LINE:
                    case LexemeType.TITLE_LINE:
                    case LexemeType.HEADING_LINE:
                    case LexemeType.PAGE_FOOTER:
                    case LexemeType.PAGE_HEADER:
                    case LexemeType.NOTE_LINE:
                    case LexemeType.LIST_LINE:
                    case LexemeType.CAPTION_LINE:
                    case LexemeType.TABLE_LINE:
                    case LexemeType.FIGURE_LINE:
                    case LexemeType.TOC_LINE:
                    case LexemeType.TEXT_LINE:
                        return {type, text: token.data, indent: token.indent, ...base} as TextLexeme
                    default:
                        throw new Error(`Token ${TokenType[token.type]} has invalid classification ${LexemeType[type]}`);
                }
        }

    }
}
