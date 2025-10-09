import type {DocumentNode} from "../Node/DocumentNode.js";
import {ArrayCursor} from "@rfc-inspector/common";
import {type Lexeme, LexemeType} from "@rfc-inspector/lexer";
import {isBlankLexeme} from "./IsBlankLexeme.js";
import type {BlankLineNode} from "../Node/BlankLineNode.js";
import {NodeType} from "../NodeType.js";

export function parseBlankNode(
    document: DocumentNode,
    _cursor: ArrayCursor<Lexeme>,
    lexeme: Lexeme
): void {
    if (!isBlankLexeme(lexeme)) {
        throw new Error(`Expected LexemeType.${LexemeType[LexemeType.BLANK]}, got ${LexemeType[lexeme.type]}.`);
    }

    document.nodes.push({
        type: NodeType.BLANK,
    } as BlankLineNode);
}