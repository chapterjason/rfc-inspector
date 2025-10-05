import type {Token} from "@rfc-inspector/tokenizer";

export interface InspectorLogicValues {
    text: string;
    tokens: Token[];
    stringifiedTokens: string;
    tokenLineIndex: Uint32Array;
    lineToTokenIndexes: Map<number, number>;
}