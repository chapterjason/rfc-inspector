import type {Specification} from "@rfc-inspector/heuristic";
import {createRuleSpecification, createSpecification} from "@rfc-inspector/heuristic";
import type {LexerParametersRecord} from "../LexerParametersRecord.js";
import {BlankLineRule} from "../Rules/BlankLineRule.js";
import {Token} from "@rfc-inspector/tokenizer";
import type {LexemeType} from "../../Lexer/Lexeme/LexemeType.js";
import {PageBreakLineRule} from "../Rules/PageBreakLineRule.js";
import {EOFLineRule} from "../Rules/EOFLineRule.js";
import {TextLineRule} from "../Rules/TextLineRule.js";
import {HeadingLineRule} from "../Rules/HeadingLineRule.js";
import {FrontPageHeaderLine} from "../Rules/FrontPageHeaderLine.js";
import {TitleLineRule} from "../Rules/TitleLineRule.js";
import {PageHeaderLineRule} from "../Rules/PageHeaderLineRule.js";
import {PageFooterLineRule} from "../Rules/PageFooterLineRule.js";
import {NoteLineRule} from "../Rules/NoteLineRule.js";
import {TableLineRule} from "../Rules/TableLineRule.js";
import {CaptionLineRule} from "../Rules/CaptionLineRule.js";
import {ListLineRule} from "../Rules/ListLineRule.js";
import {FigureLineRule} from "../Rules/FigureLineRule.js";
import {TableOfContentsLineRule} from "../Rules/TableOfContentsLineRule.js";
import {BlockquoteLineRule} from "../Rules/BlockquoteLineRule.js";

/**
 * Creates the heuristic specification for the lexer line classification.
 */
export function createLexerHeuristicSpecification(): Specification<Token, LexemeType, LexerParametersRecord> {
    const rules = [
        // Highest priority: Structural markers
        createRuleSpecification<Token, LexemeType, LexerParametersRecord>(new BlankLineRule(), 100),
        createRuleSpecification<Token, LexemeType, LexerParametersRecord>(new PageBreakLineRule(), 100),
        createRuleSpecification<Token, LexemeType, LexerParametersRecord>(new EOFLineRule(), 100),

        // Very high priority: Document structure elements
        createRuleSpecification<Token, LexemeType, LexerParametersRecord>(new FrontPageHeaderLine(), 96),
        createRuleSpecification<Token, LexemeType, LexerParametersRecord>(new TitleLineRule(), 95),
        createRuleSpecification<Token, LexemeType, LexerParametersRecord>(new PageHeaderLineRule(), 94),
        createRuleSpecification<Token, LexemeType, LexerParametersRecord>(new PageFooterLineRule(), 94),
        createRuleSpecification<Token, LexemeType, LexerParametersRecord>(new TableOfContentsLineRule(), 93),

        // Medium-high priority: Content structure
        createRuleSpecification<Token, LexemeType, LexerParametersRecord>(new BlockquoteLineRule(), 86),
        createRuleSpecification<Token, LexemeType, LexerParametersRecord>(new HeadingLineRule(), 85),
        createRuleSpecification<Token, LexemeType, LexerParametersRecord>(new CaptionLineRule(), 84),
        createRuleSpecification<Token, LexemeType, LexerParametersRecord>(new TableLineRule(), 83),
        createRuleSpecification<Token, LexemeType, LexerParametersRecord>(new FigureLineRule(), 82),
        createRuleSpecification<Token, LexemeType, LexerParametersRecord>(new NoteLineRule(), 81),
        createRuleSpecification<Token, LexemeType, LexerParametersRecord>(new ListLineRule(), 80),

        // Lower priority: Protocol body content
        //createRuleSpecification<Token, LexemeType, LexerParametersRecord>(new HttpBodyLineRule(), 70),

        // Lowest priority: Default fallback
        createRuleSpecification<Token, LexemeType, LexerParametersRecord>(new TextLineRule(), 10),
    ];

    return createSpecification<Token, LexemeType, LexerParametersRecord>(rules);
}
