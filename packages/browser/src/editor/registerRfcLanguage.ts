import {State} from "./state.js";
import {getScope} from "./getScope.js";
import {colors} from "./colors.js";
import {rules} from "./rules.js";
import {languages} from "monaco-editor";
import type {Monaco} from "@monaco-editor/react";
import {tokenize, TokenType} from "@rfc-inspector/tokenizer";

export function registerRfcLanguage(monaco: Monaco) {
    monaco.languages.register({
        id: 'rfc-tokenizer',
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
                    scopes: getScope(token),
                });
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
            ...rules,
            {token: 'rfc-whitespace', foreground: tokenColors['rfc-whitespace'].replace('#', '')},
            {token: 'rfc-page-break', foreground: tokenColors['rfc-page-break'].replace('#', '')},
            {token: 'rfc-text', foreground: tokenColors['rfc-text'].replace('#', '')},
            {token: 'rfc-newline', foreground: tokenColors['rfc-newline'].replace('#', '')},
        ]
    });
}