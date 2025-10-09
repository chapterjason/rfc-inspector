import {editor} from "monaco-editor";
import type {DocumentNode} from "@rfc-inspector/parser";
import {recomputeIfNeeded} from "./RecomputeIfNeeded.js";

export function getDocument(model: editor.ITextModel): DocumentNode {
    if (!recomputeIfNeeded(model)) {
        throw new Error("Model is not ready");
    }

    return model._rfc.document as DocumentNode;
}