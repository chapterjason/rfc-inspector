import {createRuleResult, type RuleResult} from "@rfc-inspector/heuristic";
import {AbstractLexerRule} from "./AbstractLexerRule.js";
import type {LexerContext} from "../LexerContext.js";
import {LexemeType} from "../../Lexer/Lexeme/LexemeType.js";
import {isDataToken} from "../Utils/IsDataToken.js";
import {countDataLines} from "../Utils/CountDataLines.js";
import type {LexerClassification} from "../LexerClassification.js";
import {parseTableOfContentsEntry} from "../Utils/TableOfContents/ParseTableOfContentsEntry.js";

export class HeadingLineRule extends AbstractLexerRule {
    constructor() {
        super("rfc-heading", LexemeType.HEADING_LINE);
    }

    public match(context: LexerContext): RuleResult | false {
        const token = context.cursor.peek(0);

        if (!isDataToken(token)) {
            return false;
        }

        const {indent, data} = token;

        if (indent === 0) {
            const tableOfContentEntries = context.parameters.get('tableOfContents');

            if (tableOfContentEntries !== undefined) {
                const scores = [];

                for (const tableOfContentEntry of tableOfContentEntries) {
                    const {numbering, title} = tableOfContentEntry;
                    let score = 0;

                    if (undefined !== numbering && data.includes(numbering)) {
                        score += 20;
                    }

                    if (undefined !== title && data.includes(title)) {
                        score += 80;
                    }

                    scores.push(score);
                }

                if (Math.max(...scores) === 0) {
                    // MAYBE it is still one but only missing in the TOC(?)
                    const entry = parseTableOfContentsEntry(data);

                    if (undefined === entry.numbering) {
                        return createRuleResult(countDataLines(context), 5);
                    }
                }
            }

            // @todo rework the countDataLines usage, instead maybe take only max 3 lines, and check if there is a blank line afterwards!
            return createRuleResult(countDataLines(context), 100);
        }

        return false;
    }

    onAccept(context: LexerContext, _classification: LexerClassification) {
        const token = context.cursor.peek(0);

        if (isDataToken(token)) {
            if (token.data.toLowerCase().includes('table of contents')) {
                context.parameters.set('isInTableOfContents', true);
            } else {
                context.parameters.set('isInTableOfContents', false);
            }
        }
    }
}
