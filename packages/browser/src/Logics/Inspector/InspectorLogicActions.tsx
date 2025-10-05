import type {Token} from "@rfc-inspector/tokenizer";

export interface InspectorLogicActions {
    setText: (text: string) => { text: string },
    setTokens: (tokens: Token[]) => { tokens: Token[] },
    setStringifiedTokens: (stringifiedTokens: string) => { stringifiedTokens: string },
    setLineToTokenIndexes: (lineToTokenIndexes: Map<number, number>) => { lineToTokenIndexes: Map<number, number> },
    setTokenLineIndex: (tokenLineIndex: Uint32Array) => { tokenLineIndex: Uint32Array },
}