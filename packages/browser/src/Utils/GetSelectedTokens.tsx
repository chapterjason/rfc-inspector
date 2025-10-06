import {LineToken, Token, TokenType} from "@rfc-inspector/tokenizer";
import {Selection} from "monaco-editor";
import {isSelected} from "./IsSelected";

export function getSelectedTokens(tokens: Token[], selections: Selection[]): LineToken[] {
    const selectedTokens: LineToken[] = [];

    for (const token of tokens) {
        if (token.type === TokenType.EOF) {
            break;
        }

        if (isSelected(token, selections)) {
            selectedTokens.push(token);
        }
    }

    return selectedTokens;
}