import {editor} from "monaco-editor";
import type {Lexeme} from "@rfc-inspector/lexer";
import {recomputeIfNeeded} from "./RecomputeIfNeeded.js";

export function getLexemes(model: editor.ITextModel): Lexeme[] {
    if (!recomputeIfNeeded(model)){
        throw new Error("Model is not ready");
    }

    return model._rfc.lexemes as Lexeme[];
}