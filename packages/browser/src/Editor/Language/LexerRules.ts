import { editor } from "monaco-editor";

export const lexerRules: editor.ITokenThemeRule[] = [
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
];