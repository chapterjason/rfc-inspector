import {type Token, TokenType} from "@rfc-inspector/tokenizer";
import {Selection} from "monaco-editor";

export function isSelected(token: Token, selections: Selection[]) {
    if (token.type === TokenType.EOF) {
        return false;
    }

    const {line} = token;

    for (const selection of selections) {
        if (line >= selection.startLineNumber && line <= selection.endLineNumber) {
            return true;
        }
    }

    return false;
}