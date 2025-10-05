import {actions, kea, reducers} from "kea";
import type {InspectorLogicType} from "./InspectorLogicType.js";

export const InspectorLogic = kea<InspectorLogicType>([
    actions({
        setText: (text) => ({text}),
        setTokens: (tokens) => ({tokens}),
        setStringifiedTokens: (stringifiedTokens) => ({stringifiedTokens}),
        setLineToTokenIndexes: (lineToTokenIndexes) => ({lineToTokenIndexes}),
        setTokenLineIndex: (tokenLineIndex) => ({tokenLineIndex}),
    }),
    reducers({
        text: [
            '',
            {
                setText: (_, {text}) => {
                    return text;
                },
            }
        ],
        tokens: [
            [],
            {
                setTokens: (_, {tokens}) => {
                    return [...tokens];
                },
            }
        ],
        stringifiedTokens: [
            '',
            {
                setStringifiedTokens: (_, {stringifiedTokens}) => {
                    return stringifiedTokens;
                },
            }
        ],
        tokenLineIndex: [
            new Uint32Array(0),
            {
                setTokenLineIndex: (_, {tokenLineIndex}) => {
                    return new Uint32Array(tokenLineIndex);
                },
            }
        ],
        lineToTokenIndexes: [
            new Map<number, number>(),
            {
                setLineToTokenIndexes: (_, {lineToTokenIndexes}) => {
                    return new Map(lineToTokenIndexes);
                }
            }
        ],
    }),
]);