import {ArrayCursor, getIndention, stringifyCompact} from "@rfc-inspector/common";
import {type FrontPageHeaderLexeme, type Lexeme, LexemeType} from "@rfc-inspector/lexer";
import type {DocumentNode} from "../Node/DocumentNode.js";
import type {TextNode} from "../Node/TextNode.js";
import {FrontPageHeaderNode} from "../Node/FrontPageHeaderNode.js";
import {NodeType} from "../NodeType.js";
import {FrontPageHeaderAuthorNode} from "../Node/FrontPageHeader/FrontPageHeaderAuthorNode";
import {DocumentReferenceNode} from "../Node/DocumentReferenceNode";
import {FrontPageHeaderRequestForCommentsNode} from "../Node/FrontPageHeader/FrontPageHeaderRequestForCommentsNode";
import {FrontPageHeaderListingNode} from "../Node/FrontPageHeader/FrontPageHeaderListingNode";
import {FrontPageHeaderSourceNode} from "../Node/FrontPageHeader/FrontPageHeaderSourceNode";
import {FrontPageHeaderReferenceListingNode} from "../Node/FrontPageHeader/FrontPageHeaderReferenceListingNode";

/**
 * @todo find the best number of spaces to use to determine the column
 */
function splitColumns(line: string, minSpaces = 3): [string, string] {
    const {length} = line;

    let index = 0;
    while (index < length) {
        // Find the first non-space character
        if (line[index] !== ' ') {
            break;
        }
        index++;
    }

    // Now scan for gap after that non-space
    for (let offset = index + 1; offset <= length - minSpaces; ++offset) {
        if (
            line[offset - 1] !== ' ' && // previous is NOT a space (end of content)
            line.slice(offset, offset + minSpaces) === ' '.repeat(minSpaces)
        ) {
            return [line.slice(0, offset), line.slice(offset)];
        }
    }

    return [line, ''];
}

export function isFrontPageHeaderLexeme(lexeme: Lexeme): lexeme is FrontPageHeaderLexeme {
    return lexeme.type === LexemeType.FRONT_PAGE_HEADER_LINE;
}

function splitBy(value: string, delimiter: string): string[] {
    // like this: ".split(',')" but preserve all chars
    const chars = value.split('');
    const result: string[] = [];

    let currentValue = "";

    for (const char of chars) {
        currentValue += char;
        if (char === delimiter) {
            result.push(currentValue);
            currentValue = "";
        }
    }

    if (currentValue.length > 0) {
        result.push(currentValue);
    }

    return result;
}

function parseNumberNodes(value: string, columnOffset: number, node: TextNode, numberNodes: TextNode[]) {
    for (const number of splitBy(value, ",")) {
        const indent = getIndention(number);

        const numberNode = {
            type: NodeType.TEXT,
            text: number.trimStart(),
            indent,
        } as TextNode;

        if (undefined !== node.src) {
            numberNode.src = {
                startLine: node.src.startLine, // same line
                endLine: node.src.startLine, // same line
                startColumn: columnOffset,
                endColumn: columnOffset + number.length,
            }

            columnOffset = numberNode.src.endColumn;
        }

        numberNodes.push(numberNode);
    }
}

function parseListing(node: TextNode, label: string, value: string, cursor: ArrayCursor<TextNode>): {
    key: TextNode,
    nodes: TextNode[]
} {
    const key = {
        type: NodeType.TEXT,
        text: label + ":",
        indent: node.indent,
    } as TextNode;

    let offset = 0;

    // rebuild src
    if (undefined !== node.src) {
        key.src = {
            startLine: node.src.startLine, // same line
            endLine: node.src.startLine, // same line
            startColumn: 1,
            endColumn: label.length + 2, // +1 for colon +1 for 1-indexed column
        }

        offset = key.src.endColumn;
    }

    const nodes: TextNode[] = [];

    // resolve nodes from value
    parseNumberNodes(value, offset, node, nodes);

    // resolved numbers from the following lines (if any)
    while (!cursor.isEOL() && (cursor.peek()?.indent ?? 0) > node.indent) {
        const node = cursor.next();
        parseNumberNodes(node.text, 1, node, nodes);
    }

    return {
        key,
        nodes,
    };
}

/**
 source: TextNode;
 requestForComments: number;
 category: TextNode;

 * @example: obsoletes and updates
 relations: [TextNode, TextNode[]][];

 * @example: fyi, bcp and issn
 subseries: [TextNode, number][];
 */
function parseLeftFrontPageHeaderEntries(nodes: TextNode[]): {
    source: FrontPageHeaderSourceNode,
    requestForComments: FrontPageHeaderRequestForCommentsNode,
    category: FrontPageHeaderListingNode,
    relations: FrontPageHeaderReferenceListingNode[],
    subseries: FrontPageHeaderListingNode[]
} {
    let source: FrontPageHeaderSourceNode | undefined = undefined;
    let requestForComments: FrontPageHeaderRequestForCommentsNode | undefined;
    let category: FrontPageHeaderListingNode | undefined = undefined;

    const relations: FrontPageHeaderReferenceListingNode[] = [];
    const subseries: FrontPageHeaderListingNode[] = [];

    const cursor = new ArrayCursor(nodes);

    while (!cursor.isEOL()) {
        const node = cursor.next();
        const hasColon = node.text.includes(':');

        if (undefined === source && !hasColon) {
            source = {
                type: NodeType.FRONT_PAGE_HEADER_SOURCE,
                text: node,
            } as FrontPageHeaderSourceNode;
            continue;
        }

        if (hasColon) {
            const [label, value] = node.text.split(':');

            switch (label.toLowerCase()) {
                case "request for comments": {
                    const {key, nodes} = parseListing(node, label, value, cursor);

                    if (nodes.length !== 1) {
                        throw new Error('Expected 1 item for request for comments, got ' + nodes.length);
                    }

                    requestForComments = {
                        type: NodeType.FRONT_PAGE_HEADER_REQUEST_FOR_COMMENTS,
                        label: key,
                        value: {
                            type: NodeType.DOCUMENT_REFERENCE,
                            text: nodes[0],
                            id: parseInt(nodes[0].text.trim()),
                        } as DocumentReferenceNode,
                    } as FrontPageHeaderRequestForCommentsNode;

                    break;
                }
                case "category": {
                    const {key, nodes} = parseListing(node, label, value, cursor);

                    category = {
                        type: NodeType.FRONT_PAGE_HEADER_LISTING,
                        key,
                        nodes,
                    } as FrontPageHeaderListingNode;
                    break;
                }
                case "obsoletes":
                case "updates": {
                    const {key, nodes} = parseListing(node, label, value, cursor);

                    relations.push({
                        type: NodeType.FRONT_PAGE_HEADER_REFERENCE_LISTING,
                        key,
                        nodes: nodes.map(node => ({
                            type: NodeType.DOCUMENT_REFERENCE,
                            text: node,
                            id: parseInt(node.text.trim()),
                        } as DocumentReferenceNode)),
                    } as FrontPageHeaderReferenceListingNode);

                    break;
                }
                case "bcp":
                case "fyi":
                case "issn": {
                    const {key, nodes} = parseListing(node, label, value, cursor);

                    subseries.push({
                        type: NodeType.FRONT_PAGE_HEADER_LISTING,
                        key,
                        nodes,
                    } as FrontPageHeaderListingNode);

                    break;
                }
            }
        } else {
            throw new Error('Invalid front page header line: ' + node.text);
        }
    }

    if (undefined === source) {
        console.log({nodes});
        throw new Error('Missing source: ' + nodes.map(node => node.text).join('\n'));
    }

    if (undefined === requestForComments) {
        throw new Error('Missing request for comments: ' + nodes.map(node => node.text).join('\n'));
    }

    if (undefined === category) {
        throw new Error('Missing category: ' + nodes.map(node => node.text).join('\n'));
    }

    return {
        source,
        requestForComments,
        category,
        relations,
        subseries,
    };
}

/**
 * Format "<full-month as string> <year in 4 digits>"
 */
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const expression = new RegExp(`^${months.join("|")}\\s+\\d{4}$`);

function isFrontPageHeaderDate(text: string) {
    return expression.test(text);
}

function parseRightFrontPageHeaderEntries(rightNodes: TextNode[]): [
    FrontPageHeaderAuthorNode[],
    TextNode,
] {
    const authors: FrontPageHeaderAuthorNode[] = [];
    let date: TextNode | undefined = undefined;

    const cursor = new ArrayCursor(rightNodes);

    let author: FrontPageHeaderAuthorNode | undefined = undefined;

    while (!cursor.isEOL()) {
        const node = cursor.next();

        if (isFrontPageHeaderDate(node.text)) {
            date = node;
            continue;
        }

        author = {
            type: NodeType.FRONT_PAGE_HEADER_AUTHOR,
            name: node,
        } as FrontPageHeaderAuthorNode;

        // check next line it it is NOT a date, it is the affiliation, can be empty
        const nextNode = cursor.peek();

        if (nextNode && !isFrontPageHeaderDate(nextNode.text)) {
            author.affiliation = nextNode;
            cursor.skip(1);
        }

        authors.push(author);
        author = undefined;
    }

    if (!date) {
        throw new Error('Missing date: ' + rightNodes.map(node => node.text).join('\n'));
    }

    return [authors, date];
}

export function parseFrontPageHeaderNode(
    document: DocumentNode,
    cursor: ArrayCursor<Lexeme>,
    lexeme: Lexeme,
): void {
    if (!isFrontPageHeaderLexeme(lexeme)) {
        throw new Error(`Expected LexemeType.${LexemeType[LexemeType.FRONT_PAGE_HEADER_LINE]}, got ${LexemeType[lexeme.type]}.`);
    }

    const lexemes: FrontPageHeaderLexeme[] = [
        lexeme,
        ...(cursor.peekForwardUntil(item => item.type !== LexemeType.FRONT_PAGE_HEADER_LINE) as FrontPageHeaderLexeme[]),
    ];

    const leftNodes: TextNode[] = [];
    const rightNodes: TextNode[] = [];

    for (const lexeme of lexemes) {
        cursor.skip(1);
        const [left, right] = splitColumns(" ".repeat(lexeme.indent) + lexeme.text);

        let offset = 0;

        if (left.length > 0) {
            offset = left.length + 1;

            const indent = getIndention(left);

            leftNodes.push({
                type: NodeType.TEXT,
                text: left,
                indent,
                src: {
                    startColumn: 1,
                    endColumn: offset,
                    startLine: lexeme.line,
                    endLine: lexeme.line,
                },
            });
        }

        if (undefined !== right && right.length > 0) {
            const indent = getIndention(right);
            const text = right.slice(indent);

            rightNodes.push({
                type: NodeType.TEXT,
                text,
                indent,
                src: {
                    startColumn: offset,
                    endColumn: offset + right.length,
                    startLine: lexeme.line,
                    endLine: lexeme.line,
                },
            });
        }
    }

    const {
        source,
        requestForComments,
        category,
        relations,
        subseries
    } = parseLeftFrontPageHeaderEntries(leftNodes);

    const [
        authors,
        date,
    ] = parseRightFrontPageHeaderEntries(rightNodes)

    document.nodes.push({
        type: NodeType.FRONT_PAGE_HEADER,
        nodes: [
            source,
            requestForComments,
            category,
            ...relations,
            ...subseries,
            ...authors,
            date,
        ],
    } as FrontPageHeaderNode);
}