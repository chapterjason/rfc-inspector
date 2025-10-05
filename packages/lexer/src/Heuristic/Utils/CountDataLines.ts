import type {LexerContext} from "../LexerContext.js";
import {isDataToken} from "./IsDataToken.js";

export function countDataLines(context: LexerContext) {
    let amount = 0;

    while (context.cursor.hasNext()) {
        const token = context.cursor.peek();

        if (isDataToken(token)) {
            context.cursor.skip();
            amount++;
        } else {
            break;
        }
    }

    return amount;
}