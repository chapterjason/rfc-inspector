import type {RuleResult} from "@rfc-inspector/heuristic";
import {createRuleResult} from "@rfc-inspector/heuristic";
import {AbstractLexerRule} from "./AbstractLexerRule.js";
import type {LexerContext} from "../LexerContext.js";
import {LexemeType} from "../../Lexer/Lexeme/LexemeType.js";
import {isDataToken} from "../Utils/IsDataToken.js";
import {isBlankLineToken} from "../Utils/IsBlankLineToken.js";
import {isFormFeedToken} from "../Utils/IsFormFeedToken";

function trimEnd<T>(items: T[], predicate: (item: T) => boolean) {
    let i = items.length - 1;

    while (i >= 0 && predicate(items[i])) {
        i--;
    }

    return items.slice(0, i + 1);
}

export class ListLineRule extends AbstractLexerRule {
    private static expressions = [
        /**
         * @example - value
         * @example * value
         * @example + value
         * @example o value
         */
        /^[ ]*([-*+o])([ ]+)\S/mi,

        /**
         * @example 1. value
         * @example a. value
         * @example iv. value
         * @example 1) value
         * @example a) value
         * @example iv) value
         */
        /^[ ]*((?:\d+|[a-z]|[ivxlcdm]+)[.)])([ ]+)\S/mi,

        /**
         * @example (1) value
         * @example (a) value
         * @example (iv) value
         */
        /^[ ]*(\((?:\d+|[a-z]|[ivxlcdm]+)\))([ ]+)\S/mi,

        /**
         * @example [RFC5226]
         * @example [USASCII]
         * @example [W3C.REC-html401-19991224]
         * @example [OAuth-THREATMODEL]
         */
        /^[ ]*(\[[a-z0-9-._]+])([ ]{2,})\S/mi,
    ]

    constructor() {
        super("rfc-list", LexemeType.LIST_LINE);
    }

    static matchList(data: string): RegExpMatchArray | null {
        for (const expression of ListLineRule.expressions) {
            const match = expression.exec(data);

            if (null !== match) {
                return match;
            }
        }

        return null;
    }

    public match(context: LexerContext): RuleResult | false {
        const token = context.cursor.peek(0);

        if (!isDataToken(token)) {
            return false;
        }

        if (!this.matchRequirements(context)) {
            return false;
        }

        let indent = 0;

        const match = ListLineRule.matchList(token.data);

        if (null !== match) {
            context.cursor.next(); // consume token

            indent = token.indent + match[1].length + match[2].length;
        } else {
            /**
             * Maybe it is a definition list?
             *   - Next line MUST be a DataLine and have a higher indent at least 1 more space
             */

            const nextToken = context.cursor.peek(1);

            if (!isDataToken(nextToken)) {
                return false;
            }

            // Try to avoid any code blocks
            if (token.indent !== 3) {
                return false;
            }

            // ignore regular paragraph text or less indented lines like heading lines
            if (nextToken.indent <= token.indent) {
                return false;
            }

            // EDGE CASES:
            // Avoid matching some code blocks that aren't properly indented
            if (
                token.data.endsWith('(') || // RFC9700:2191
                token.data.endsWith('{') || // RFC9700:2210
                token.data.startsWith('GET ') // RFC9700:683
            ) {
                return false;
            }

            // ohh U have a data line token on which the next line is a data line with a higher indent!
            context.cursor.next(); // consume token

            indent = nextToken.indent;
        }

        let amount = 1; // the marker line

        // COLLECT EVERY LINE UNTIL the indent gets smaller, while ignoring, blanks lines and page markers
        const tokens = context.cursor.peekForwardUntil((token, offset) => {
            if (isBlankLineToken(token)) {
                return false;
            }

            if (isFormFeedToken(token)) {
                return false;
            }

            if (isDataToken(token)) {
                // check the next token, to be a form feed, that means the current line is a page footer. (return false)
                const nextToken = context.cursor.peek(offset + 1);

                if (isFormFeedToken(nextToken)) {
                    return false;
                }

                // check the previous token, to be a form feed, that means the current line is a page header. (return false)
                const previousToken = context.cursor.peek(offset - 1);

                if (isFormFeedToken(previousToken)) {
                    return false;
                }

                return token.indent < indent;
            }

            return true;
        });

        // trim blank lines from the end, as they are not part of the list
        const trimmed = trimEnd(tokens, (token) => isBlankLineToken(token));

        amount += trimmed.length;

        if (amount > 0) {
            return createRuleResult(amount, 80);
        }

        return false;
    }

    /**
     * Check if the last index classification is either a blank line or a list line
     */
    private matchRequirements(context: LexerContext): boolean {
        const lastIndex = context.cursor.getIndex() - 1;
        const lastClassification = context.findClassificationAtIndex(lastIndex)

        if (!lastClassification) {
            return false;
        }

        return [
            LexemeType.LIST_LINE,
            LexemeType.BLANK,
        ].includes(lastClassification.rule.type);
    }
}
