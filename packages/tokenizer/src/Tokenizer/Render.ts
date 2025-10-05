import type {Token} from "./Token/Token.js";
import {TokenType} from "./Token/TokenType.js";

export function render(tokens: readonly Token[]): string {
    let result = "";
    const NL = "\n";

    for (let index = 0; index < tokens.length; index += 1) {
        const token = tokens[index];

        switch (token.type) {
            case TokenType.EOF:
                if (index < tokens.length - 1) {
                    throw new Error(`EOF token must be the final token (index ${index}, length ${tokens.length})`);
                }

                break;
            case TokenType.BLANK_LINE:
                result += NL;
                continue;
            case TokenType.DATA_LINE:
                result += " ".repeat(token.indent) + token.data + NL;
                continue;
            case TokenType.FORM_FEED_LINE:
                result += '\f' + NL;
                continue;
            default:
                throw new Error(`Unknown token type: ${JSON.stringify(token)}`);
        }
    }

    return result;
}
