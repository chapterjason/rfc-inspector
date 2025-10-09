import {State} from "./state.js";
import {colors} from "./colors.js";
import {CancellationToken, editor, languages} from "monaco-editor";
import type {Monaco} from "@monaco-editor/react";
import {Token, tokenize, TokenType} from "@rfc-inspector/tokenizer";
import {Lexeme, LexemeType, Lexer} from "@rfc-inspector/lexer";
import {Node, NodeType, parse, TreeWalker} from "@rfc-inspector/parser";
import {chunk, stringifyCompact} from "@rfc-inspector/common";
import {NodeEncoder} from "./encoder.js";

const lexer = new Lexer();
const treeWalker = new TreeWalker();

export function normalizeType(type: string): string {
    return type.toLowerCase().replace(/_/g, '-');
}

export function getTokenType(token: Token | TokenType): string {
    if (hasTypeProperty(token)) {
        return getTokenType(token.type);
    }

    return 'rfc-token-' + normalizeType(TokenType[token]);
}

export function getLexemeType(lexeme: Lexeme | LexemeType): string {
    if (hasTypeProperty(lexeme)) {
        return getLexemeType(lexeme.type);
    }

    return 'rfc-lexeme-' + normalizeType(LexemeType[lexeme]);
}

export function hasTypeProperty<T>(value: unknown): value is { type: T } {
    return (value as { type?: T }).type !== undefined;
}

export function getNodeType(node: Node | NodeType): string {
    if (hasTypeProperty(node)) {
        return getNodeType(node.type);
    }

    return 'rfc-node-' + normalizeType(NodeType[node]);
}

export function getEnumValues(instance: object): string[] {
    return Object.values(instance).filter((value: string | number) => isNaN(Number(value)));
}

export const tokenTypes = getEnumValues(TokenType)
    .map((type: string) => 'rfc-token-' + normalizeType(type));

export const lexemeTypes = getEnumValues(LexemeType)
    .map((type: string) => 'rfc-lexeme-' + normalizeType(type));

export const nodeTypes = getEnumValues(NodeType)
    .map((type: string) => 'rfc-node-' + normalizeType(type));

const nodeEncoder = new NodeEncoder(nodeTypes);

export function registerRfcLanguage(monaco: Monaco) {
    monaco.languages.register({id: 'rfc-tokenizer'});
    monaco.languages.register({id: 'rfc-lexer'});
    monaco.languages.register({id: 'rfc-parser'});

    monaco.languages.setTokensProvider('rfc-tokenizer', {
        getInitialState: () => new State(1),
        tokenize: (line: string, state: languages.IState): languages.ILineTokens => {
            const tokens = tokenize(line);
            const result: languages.IToken[] = [];

            for (const token of tokens) {
                if (token.type === TokenType.EOF) {
                    break;
                }

                result.push({
                    startIndex: token.offset,
                    scopes: getTokenType(token),
                });
            }

            return {
                tokens: result,
                endState: state,
            }
        }
    });

    monaco.languages.registerDocumentSemanticTokensProvider('rfc-lexer', {
        getLegend(): languages.SemanticTokensLegend {
            return {
                tokenTypes: lexemeTypes,
                tokenModifiers: [],
            } as languages.SemanticTokensLegend;
        },
        provideDocumentSemanticTokens(
            model: editor.ITextModel,
            _lastResultId: string | null,
            _token: CancellationToken
        ): languages.ProviderResult<languages.SemanticTokens | languages.SemanticTokensEdits> {
            const value = model.getValue() ?? '';
            const tokens = Array.from(tokenize(value));
            const lexemes = lexer.lex(tokens);
            const data: number[] = [];

            let lineNumber = 0;
            let previousLine = 0;

            for (const lexeme of lexemes) {
                if (lexeme.type === LexemeType.EOF) {
                    break;
                }

                const currentLine = lineNumber;

                const type = lexemeTypes.indexOf(getLexemeType(lexeme));

                if (type === -1) {
                    continue;
                }

                if (lexeme.type === LexemeType.BLANK) {
                    lineNumber++;
                    continue;
                }

                let length = 1;
                let offset = 0;

                if (lexeme.type !== LexemeType.PAGE_BREAK) {
                    offset = lexeme.indent;
                    length = lexeme.text.length;
                }

                const deltaLine = (data.length === 0) ? currentLine : (currentLine - previousLine);

                data.push(
                    deltaLine,
                    offset,
                    length,
                    type,
                    0,
                );

                previousLine = currentLine;
                lineNumber++;
            }

            console.log(stringifyCompact(chunk(data, 6)));

            return {
                data: new Uint32Array(data),
            } as languages.SemanticTokens;
        },
        releaseDocumentSemanticTokens(_resultId: string | undefined) {
            // noop
        },
    });

    monaco.languages.registerDocumentSemanticTokensProvider('rfc-parser', {
        getLegend(): languages.SemanticTokensLegend {
            return {
                tokenTypes: nodeTypes,
                tokenModifiers: [],
            } as languages.SemanticTokensLegend;
        },
        provideDocumentSemanticTokens(
            model: editor.ITextModel,
            _lastResultId: string | null,
            _token: CancellationToken
        ): languages.ProviderResult<languages.SemanticTokens | languages.SemanticTokensEdits> {
            const value = model.getValue() ?? '';
            const tokens = Array.from(tokenize(value));
            const lexemes = lexer.lex(tokens);
            const document = parse(lexemes);

            const data = nodeEncoder.encode(document).flat();

            console.log(stringifyCompact(chunk(data, 5)));

            return {
                data: new Uint32Array(data),
            } as languages.SemanticTokens;
        },
        releaseDocumentSemanticTokens(_resultId: string | undefined) {
            // noop
        },
    });

    monaco.languages.registerLinkProvider("rfc-parser", {
        provideLinks(model: editor.ITextModel, _token: CancellationToken): languages.ProviderResult<languages.ILinksList> {
            const value = model.getValue() ?? '';
            const tokens = Array.from(tokenize(value));
            const lexemes = lexer.lex(tokens);
            const document = parse(lexemes);

            const links: languages.ILink[] = [];

            treeWalker.walk(document, (node) => {
               if (node.type === NodeType.DOCUMENT_REFERENCE && undefined !== node.text.src) {
                   const {indent} = node.text;
                   const {startLine,endLine,startColumn,endColumn} = node.text.src;

                   links.push({
                       url: `https://www.rfc-editor.org/info/rfc${node.id}`,
                       tooltip: `https://www.rfc-editor.org/info/rfc${node.id}`,
                       range: {
                           startLineNumber: startLine,
                           endLineNumber: endLine,
                           endColumn,
                           startColumn: startColumn + indent,
                       },
                   } as languages.ILink);
               }
            });

            return  {
                links,
                dispose: () => {
                    // noop
                },
            }
        }
    })

    monaco.editor.defineTheme('rfc', {
        base: "vs-dark",
        inherit: true,
        colors: {
            ...colors,
        },
        rules: [
            {token: "rfc-lexeme-blank", foreground: '6e7681'},
            {token: "rfc-lexeme-eof", foreground: 'ff7b72', fontStyle: 'bold'},
            {token: "rfc-lexeme-front-page_header_line", foreground: '9ecbff', fontStyle: 'italic'},
            {token: "rfc-lexeme-title-line", foreground: 'ffd33d', fontStyle: 'bold underline'},
            // {token: "rfc-lexeme-page-footer", foreground: '79c0ff', fontStyle: 'underline'},
            {token: "rfc-lexeme-page-footer", foreground: '82e5d9', fontStyle: 'underline'},
            // {token: "rfc-lexeme-page-break", foreground: 'a371f7'},
            {token: "rfc-lexeme-page-break", foreground: '82e5d9'},
            // {token: "rfc-lexeme-page-header", foreground: '58a6ff', fontStyle: 'underline'},
            {token: "rfc-lexeme-page-header", foreground: '82e5d9', fontStyle: 'underline'},
            {token: "rfc-lexeme-heading-line", foreground: 'd2a8ff', fontStyle: 'bold underline'},
            {token: "rfc-lexeme-toc-line", foreground: '2dd4bf', fontStyle: 'italic'},
            {token: "rfc-lexeme-text-line", foreground: 'c9d1d9'},
            {token: "rfc-lexeme-list-line", foreground: 'ffa657'},
            {token: "rfc-lexeme-blockquote-line", foreground: 'ff80bf', fontStyle: 'italic'},
            {token: "rfc-lexeme-code-line", foreground: '7ee787'},
            {token: "rfc-lexeme-caption-line", foreground: 'ae9dfb', fontStyle: 'bold italic underline'},
            {token: "rfc-lexeme-note-line", foreground: 'e3b341', fontStyle: 'bold'},
            {token: "rfc-lexeme-figure-line", foreground: 'b3f0ff'},
            {token: "rfc-lexeme-table-line", foreground: 'f778ba'},

            // NODE
            { token: "rfc-node-document", foreground: 'ff0000' },
            { token: "rfc-node-blank", foreground: 'ff0000' },
            { token: "rfc-node-text", foreground: 'ff0000' },
            { token: "rfc-node-paragraph", foreground: 'ff0000' },
            { token: "rfc-node-document-reference", foreground: '0000EE', fontStyle: 'underline' },

            { token: "rfc-node-front-page-header", foreground: 'ff0000' },
            { token: "rfc-node-front-page-header-source", foreground: 'ff0000', fontStyle: 'underline' },
            { token: "rfc-node-front-page-header-request-for-comments", foreground: 'ff0000' },
            { token: "rfc-node-front-page-header-reference-listing", foreground: 'ff0000' },
            { token: "rfc-node-front-page-header-listing", foreground: 'ff0000' },
            { token: "rfc-node-front-page-header-author", foreground: '00ff00' },

            { token: "rfc-node-title", foreground: '0000ff' },
            { token: "rfc-node-table-of-contents", foreground: 'ff0000' },
            { token: "rfc-node-table-of-contents-entry", foreground: 'ff0000' },
            { token: "rfc-node-section-title", foreground: 'ff0000' },
        ]
    });
}