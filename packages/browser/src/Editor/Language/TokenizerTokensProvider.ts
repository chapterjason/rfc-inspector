import {languages} from "monaco-editor";
import {State} from "./State.js";
import {tokenize, TokenType} from "@rfc-inspector/tokenizer";
import {getTokenType} from "../../Utils/GetTokenType.js";

export class TokenizerTokensProvider implements languages.TokensProvider {
    public getInitialState(): languages.IState {
        return new State(1)
    }

    public tokenize(line: string, state: languages.IState): languages.ILineTokens {
        const tokens = tokenize(line);
        const result: languages.IToken[] = [];

        for (const token of tokens) {
            if (token.type === TokenType.EOF) {
                break;
            }

            result.push({
                startIndex: token.offset,
                scopes: getTokenType(token),
            });
        }

        return {
            tokens: result,
            endState: state,
        }
    }
}