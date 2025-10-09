import {baseColors} from "./BaseColors.js";
import type {Monaco} from "@monaco-editor/react";
import {LexerDocumentSemanticTokensProvider} from "./Language/LexerDocumentSemanticTokensProvider.js";
import {ParserDocumentSemanticTokensProvider} from "./Language/ParserDocumentSemanticTokensProvider.js";
import {ParserLinkProvider} from "./Language/ParserLinkProvider.js";
import {TokenizerTokensProvider} from "./Language/TokenizerTokensProvider.js";
import {lexerRules} from "./Language/LexerRules.js";
import {parserRules} from "./Language/ParserRules.js";

export function registerRfcLanguage(monaco: Monaco) {
    monaco.languages.register({id: 'rfc-tokenizer'});
    monaco.languages.register({id: 'rfc-lexer'});
    monaco.languages.register({id: 'rfc-parser'});

    monaco.languages.setTokensProvider('rfc-tokenizer', new TokenizerTokensProvider());
    monaco.languages.registerDocumentSemanticTokensProvider('rfc-lexer', new LexerDocumentSemanticTokensProvider());
    monaco.languages.registerDocumentSemanticTokensProvider('rfc-parser', new ParserDocumentSemanticTokensProvider());
    monaco.languages.registerLinkProvider("rfc-parser", new ParserLinkProvider())

    monaco.editor.defineTheme('rfc', {
        base: "vs-dark",
        inherit: true,
        colors: {
            ...baseColors,
        },
        rules: [
            ...lexerRules,
            ...parserRules,
        ]
    });
}