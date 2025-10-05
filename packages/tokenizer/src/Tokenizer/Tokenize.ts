import type {Token} from "./Token/Token.js";
import {TokenType} from "./Token/TokenType.js";
import type {DataLineToken} from "./Token/DataLineToken.js";
import type {BlankLineToken} from "./Token/BlankLineToken.js";
import type {FormFeedLineToken} from "./Token/FormFeedLineToken.js";
import type {EOFToken} from "./Token/EOFToken.js";

export const CHAR_SPACE = 32
export const CHAR_FORM_FEED = 12;

export function* tokenize(inputText: string): Generator<Token, void, unknown> {
    const inputLength = inputText.length;

    let cursor = 0;
    let line = 1;

    while (cursor < inputLength) {
        let newlineIndex = inputText.indexOf('\n', cursor);

        if (newlineIndex === -1) {
            newlineIndex = inputLength;
        }

        const offset = cursor;
        const endIndex = newlineIndex;

        // PAGE_BREAK: exactly a single form-feed
        if (endIndex === offset + 1 && inputText.charCodeAt(offset) === CHAR_FORM_FEED) {
            yield {
                type: TokenType.FORM_FEED_LINE,
                offset,
                line,
            } as FormFeedLineToken;

            cursor = newlineIndex + 1;
            line++;

            continue;
        }

        if (endIndex === offset) {
            yield {
                type: TokenType.BLANK_LINE,
                offset,
                line,
            } as BlankLineToken;

            cursor = newlineIndex + 1;
            line++;

            continue;
        }

        let firstNonSpaceIndex = offset;

        while (firstNonSpaceIndex < endIndex && inputText.charCodeAt(firstNonSpaceIndex) === CHAR_SPACE) {
            firstNonSpaceIndex++;
        }

        const indent = firstNonSpaceIndex - offset;
        const data = inputText.substring(firstNonSpaceIndex, endIndex);

        yield {
            type: TokenType.DATA_LINE,
            data,
            indent,
            offset,
            line,
        } as DataLineToken;

        cursor = newlineIndex + 1;
        line++;
    }

    yield {type: TokenType.EOF} as EOFToken;
}