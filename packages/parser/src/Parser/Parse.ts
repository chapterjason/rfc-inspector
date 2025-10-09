import {type Lexeme, LexemeType} from "@rfc-inspector/lexer";
import {ArrayCursor} from "@rfc-inspector/common";
import {parseFrontPageHeaderNode} from "./Parse/ParseFrontPageHeaderNode.js";
import {NodeType} from "./NodeType.js";
import type {DocumentNode} from "./Node/DocumentNode.js";
import {parseBlankNode} from "./Parse/ParseBlankNode.js";

export function parse(lexemes: Lexeme[]): DocumentNode {
    const document: DocumentNode = {
        type: NodeType.DOCUMENT,
        nodes: [],
    };

    const cursor = new ArrayCursor(lexemes);
    // @todo implement parsing logic here

    while (!cursor.isEOL()) {
        const lexeme = cursor.next();

        if (lexeme.type === LexemeType.EOF) {
            break;
        }

        switch (lexeme.type) {
            case LexemeType.BLANK:
                parseBlankNode(document, cursor, lexeme);
                break;
            case LexemeType.FRONT_PAGE_HEADER_LINE:
                parseFrontPageHeaderNode(document, cursor, lexeme);
                break;
            default:
                //throw new Error(`Can not parse type: ${LexemeType[lexeme.type]}, yet.`);
        }
    }

    return document;
}