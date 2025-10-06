import {State} from "./state.js";
import {getTokenScope} from "./getTokenScope";
import {colors} from "./colors.js";
import {CancellationToken, editor, languages} from "monaco-editor";
import type {Monaco} from "@monaco-editor/react";
import {tokenize, TokenType} from "@rfc-inspector/tokenizer";
import {LexemeType, Lexer} from "@rfc-inspector/lexer";
import {getLexemeScope} from "./getLexemeScope";

const lexer = new Lexer();

export function registerRfcLanguage(monaco: Monaco) {
    monaco.languages.register({
        id: 'rfc',
    });

    monaco.languages.register({
        id: 'rfc-tokenizer',
    });

    monaco.languages.register({
        id: 'rfc-lexer',
    });

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
                    scopes: getTokenScope(token),
                });
            }

            return {
                tokens: result,
                endState: state,
            }
        }
    });

    function normalizeType(type: string): string {
        return 'rfc-lexeme-' + type.toLowerCase().replace('_', '-');
    }

    const tokenTypes = [
        "rfc-lexeme-blank",
        "rfc-lexeme-page-break",
        "rfc-lexeme-eof",
        "rfc-lexeme-front-page_header_line",
        "rfc-lexeme-title-line",
        "rfc-lexeme-page-header",
        "rfc-lexeme-page-footer",
        "rfc-lexeme-heading-line",
        "rfc-lexeme-toc-line",
        "rfc-lexeme-text-line",
        "rfc-lexeme-list-line",
        "rfc-lexeme-blockquote-line",
        "rfc-lexeme-code-line",
        "rfc-lexeme-caption-line",
        "rfc-lexeme-note-line",
        "rfc-lexeme-figure-line",
        "rfc-lexeme-table-line",
    ];

    class NullState implements languages.IState {
        clone() { return this; }
        equals(_other: languages.IState) { return true; }
    }


    monaco.languages.setTokensProvider('rfc', {
        getInitialState: () => new State(1),
        tokenize: (line: string, state: languages.IState): languages.ILineTokens => {
            const tokens = [];

            if (line.length > 0){
                tokens.push({startIndex: 0, scopes: 'wholeLine'});
            }

            return {
                tokens,
                endState: state
            };
        }
    });

    monaco.languages.registerDocumentSemanticTokensProvider('rfc', {
        getLegend(): languages.SemanticTokensLegend {
            console.log('used?');
            return {
                tokenTypes,
                tokenModifiers: [],
            } as languages.SemanticTokensLegend;
        },
        provideDocumentSemanticTokens(
            model: editor.ITextModel,
            lastResultId: string | null,
            token: CancellationToken
        ): languages.ProviderResult<languages.SemanticTokens | languages.SemanticTokensEdits> {
            console.log('used?');
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

                const type = tokenTypes.indexOf(normalizeType(LexemeType[lexeme.type]));

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

            return {
                data: new Uint32Array(data),
            } as languages.SemanticTokens;
        },
        releaseDocumentSemanticTokens(_resultId: string | undefined) {
            // noop
            console.log('used?');
        },
    });

    monaco.languages.setTokensProvider('rfc-lexer', {
        getInitialState: () => new State(1),
        tokenize: (line: string, state: languages.IState): languages.ILineTokens => {
            const tokens = Array.from(tokenize(line));
            const lexemes = lexer.lex(tokens);
            const result: languages.IToken[] = [];

            for (const lexeme of lexemes) {
                if (lexeme.type === LexemeType.EOF) {
                    break;
                }

                result.push({
                    startIndex: lexeme.offset,
                    scopes: getLexemeScope(lexeme),
                } as languages.IToken);
            }

            return {
                tokens: result,
                endState: state,
            }
        }
    });

    const tokenColors = {
        'rfc-whitespace': '#e5c07b',
        'rfc-page-break': '#ff6b6b',
        'rfc-text': '#d7dae0',
        'rfc-newline': '#7a5cff'
    }

    monaco.editor.defineTheme('rfc', {
        base: "vs-dark",
        inherit: true,
        colors: {
            ...colors,
        },
        rules: [
            /*
            ...rules,
            {token: 'rfc-whitespace', foreground: tokenColors['rfc-whitespace'].replace('#', '')},
            {token: 'rfc-page-break', foreground: tokenColors['rfc-page-break'].replace('#', '')},
            {token: 'rfc-text', foreground: tokenColors['rfc-text'].replace('#', '')},
            {token: 'rfc-newline', foreground: tokenColors['rfc-newline'].replace('#', '')},
*/

            {token: "rfc-lexeme-blank", foreground: '6e7681'},
            {token: "rfc-lexeme-page-break", foreground: 'a371f7', fontStyle: 'underline'},
            {token: "rfc-lexeme-eof", foreground: 'ff7b72', fontStyle: 'bold'},
            {token: "rfc-lexeme-front-page_header_line", foreground: '9ecbff', fontStyle: 'italic'},
            {token: "rfc-lexeme-title-line", foreground: 'ffd33d', fontStyle: 'bold'},
            {token: "rfc-lexeme-page-header", foreground: '58a6ff'},
            {token: "rfc-lexeme-page-footer", foreground: '79c0ff'},
            {token: "rfc-lexeme-heading-line", foreground: 'd2a8ff', fontStyle: 'bold'},
            {token: "rfc-lexeme-toc-line", foreground: '2dd4bf', fontStyle: 'italic'},
            {token: "rfc-lexeme-text-line", foreground: 'c9d1d9'},
            {token: "rfc-lexeme-list-line", foreground: 'ffa657'},
            {token: "rfc-lexeme-blockquote-line", foreground: 'ff80bf', fontStyle: 'italic'},
            {token: "rfc-lexeme-code-line", foreground: '7ee787'},
            {token: "rfc-lexeme-caption-line", foreground: 'ae9dfb', fontStyle: 'italic'},
            {token: "rfc-lexeme-note-line", foreground: 'e3b341', fontStyle: 'bold'},
            {token: "rfc-lexeme-figure-line", foreground: 'b3f0ff'},
            {token: "rfc-lexeme-table-line", foreground: 'f778ba'},

        ]
    });
}