import {getNodeType} from "./registerRfcLanguage.js";
import {
    type DocumentReferenceNode, type FrontPageHeaderAuthorNode,
    type FrontPageHeaderSourceNode,
    type Node,
    type SourceReference,
    TreeWalker
} from "@rfc-inspector/parser";

export type EncodedToken = [
    number, // deltaLine
    number, // deltaColumn
    number, // length
    number, // typeIndex
    number, // modifierIndex
];

export interface SemanticToken {
    node: Node;

    lineIndex: number;
    columnIndex: number;
    length: number;
    typeIndex: number;
    modifierIndex: number;
}

export class NodeEncoder extends TreeWalker {
    protected semanticTokens: SemanticToken[] = [];

    public constructor(
        private readonly tokenTypes: string[] = [],
        private readonly tokenModifiers: string[] = [], // @todo implement
    ) {
        super();
    }

    public encode(node: Node): EncodedToken[] {
        this.semanticTokens = [];
        this.walk(node, () => {
            // noop
        });
        return this.encodeTokens(this.semanticTokens);
    }


    protected walkFrontPageHeaderSource(node: FrontPageHeaderSourceNode, _callback: (node: Node) => void) {
        const {text, type} = node;

        const typeIndex = this.tokenTypes.indexOf(getNodeType(type));

        // node without type or a source reference can't be encoded
        if (typeIndex === -1 || undefined === text.src) {
            return;
        }

        this.semanticTokens.push(this.buildSemanticToken(node, typeIndex, text.src));
    }

    protected walkDocumentReferenceNode(node: DocumentReferenceNode, _callback: (node: Node) => void) {
        const {text, type} = node;

        const typeIndex = this.tokenTypes.indexOf(getNodeType(type));

        // node without type or a source reference can't be encoded
        if (typeIndex === -1 || undefined === text.src) {
            return;
        }

        const source = text.src;

        this.semanticTokens.push(this.buildSemanticToken(node, typeIndex, {
            startLine: source.startLine,
            endLine: source.endLine,
            startColumn: source.startColumn + text.indent,
            endColumn: source.endColumn,
        }));
    }

    protected walkFrontPageHeaderAuthorNode(node: FrontPageHeaderAuthorNode, _callback: (node: Node) => void) {
        const {type,name,affiliation} = node;

        const typeIndex = this.tokenTypes.indexOf(getNodeType(type));

        // node without type or a source reference can't be encoded
        if (typeIndex === -1 || undefined === name.src) {
            return;
        }

        this.semanticTokens.push(this.buildSemanticToken(node, typeIndex, name.src));

        if (affiliation !== undefined && affiliation.src !== undefined) {
            this.semanticTokens.push(this.buildSemanticToken(node, typeIndex+1, affiliation.src));
        }
    }

    private encodeTokens(semanticTokens: SemanticToken[]): EncodedToken[] {
        semanticTokens = semanticTokens.sort((a, b) => {
            if (a.lineIndex !== b.lineIndex) {
                return a.lineIndex - b.lineIndex;
            }

            return a.columnIndex - b.columnIndex;
        });

        const encodedTokens: EncodedToken[] = [];

        let previousLineIndex = 0;
        let previousColumnIndex = 0;

        for (const semanticToken of semanticTokens) {
            const {
                typeIndex,
                lineIndex,
                columnIndex,
                modifierIndex,
                length,
            } = semanticToken;

            const currentLineIndex = lineIndex;

            if (currentLineIndex !== previousLineIndex) {
                previousColumnIndex = 0;
            }

            const deltaLine = (previousLineIndex === 0) ? currentLineIndex : (currentLineIndex - previousLineIndex);
            const deltaStart = (previousColumnIndex === 0) ? columnIndex : (columnIndex - previousColumnIndex);

            encodedTokens.push([
                deltaLine,
                deltaStart,
                length,
                typeIndex,
                modifierIndex,
            ] as EncodedToken);

            previousColumnIndex = deltaStart;
            previousLineIndex = currentLineIndex;
        }

        return encodedTokens;
    }

    private buildSemanticToken(node: Node, typeIndex: number, source: SourceReference): SemanticToken {
        const {startLine, startColumn, endColumn} = source;

        return {
            node,
            lineIndex: startLine - 1,
            columnIndex: startColumn - 1,
            length: endColumn - startColumn,
            typeIndex,
            modifierIndex: 0, // @todo implement
        } as SemanticToken;
    }
}