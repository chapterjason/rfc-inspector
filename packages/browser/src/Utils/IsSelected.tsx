import {LineToken} from "@rfc-inspector/tokenizer";
import {Selection} from "monaco-editor";
import {LexemeLine} from "@rfc-inspector/lexer";

export function isSelected(token: LineToken | LexemeLine, selections: Selection[]) {
    const {line} = token;

    for (const selection of selections) {
        if (line >= selection.startLineNumber && line <= selection.endLineNumber) {
            return true;
        }
    }

    return false;
}