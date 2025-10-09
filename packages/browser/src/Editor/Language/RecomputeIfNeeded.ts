import {editor} from "monaco-editor";
import {type Token, tokenize} from "@rfc-inspector/tokenizer";
import {type DocumentNode, parse} from "@rfc-inspector/parser";
import {type Lexeme, Lexer} from "@rfc-inspector/lexer";
import {needsUpdate} from "./NeedsUpdate.js";

const lexer = new Lexer();

export function recomputeIfNeeded(model: editor.ITextModel): model is editor.ITextModel & {
    _rfc: {
        needsUpdate: false,
        tokens: Token[],
        lexemes: Lexeme[],
        document: DocumentNode,
    }
} {
    const value = model.getValue() ?? '';

    if (model._rfc === undefined) {
        model._rfc = {needsUpdate: true};
    }

    if (model._rfc.needsUpdate === undefined) {
        model._rfc.needsUpdate = true;
    }

    if (model._rfc.tokens === undefined) {
        model._rfc.tokens = Array.from(tokenize(value));
    }

    if (model._rfc.lexemes === undefined) {
        model._rfc.lexemes = lexer.lex(model._rfc.tokens);
    }

    if (model._rfc.document === undefined) {
        model._rfc.document = parse(model._rfc.lexemes);
    }

    if (needsUpdate(model)) {
        model._rfc.tokens = Array.from(tokenize(value));
        model._rfc.lexemes = lexer.lex(model._rfc.tokens);
        model._rfc.document = parse(model._rfc.lexemes);
    }

    model._rfc.needsUpdate = false;

    return true;
}