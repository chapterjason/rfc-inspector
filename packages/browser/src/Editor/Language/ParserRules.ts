import {editor} from "monaco-editor";


export const parserRules: editor.ITokenThemeRule[] = [
    {token: "rfc-node-document", foreground: 'ff0000'},
    {token: "rfc-node-blank", foreground: 'ff0000'},
    {token: "rfc-node-text", foreground: 'ff0000'},
    {token: "rfc-node-paragraph", foreground: 'ff0000'},
    {token: "rfc-node-document-reference", foreground: '0000EE', fontStyle: 'underline'},

    {token: "rfc-node-front-page-header", foreground: 'ff0000'},
    {token: "rfc-node-front-page-header-source", foreground: 'ff0000', fontStyle: 'underline'},
    {token: "rfc-node-front-page-header-request-for-comments", foreground: 'ff0000'},
    {token: "rfc-node-front-page-header-reference-listing", foreground: 'ff0000'},
    {token: "rfc-node-front-page-header-listing", foreground: 'ff0000'},
    {token: "rfc-node-front-page-header-author", foreground: '00ff00'},

    {token: "rfc-node-title", foreground: '0000ff'},
    {token: "rfc-node-table-of-contents", foreground: 'ff0000'},
    {token: "rfc-node-table-of-contents-entry", foreground: 'ff0000'},
    {token: "rfc-node-section-title", foreground: 'ff0000'},
];