import {editor} from "monaco-editor";
import type {Token} from "@rfc-inspector/tokenizer";
import {recomputeIfNeeded} from "./RecomputeIfNeeded.js";

export function getTokens(model: editor.ITextModel): Token[] {
    if (!recomputeIfNeeded(model)){
        throw new Error("Model is not ready");
    }

    return model._rfc.tokens as Token[];
}