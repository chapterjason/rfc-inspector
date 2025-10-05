import React, {createContext, type PropsWithChildren, useMemo, useState} from "react";
import type {Token} from "@rfc-inspector/tokenizer";

export interface InspectorContextValue {
    text: string;

    tokenizerTokens: Token[];

    setText: (text: string) => void;
    setTokenizerTokens: (tokens: Token[]) => void;
}

export const InspectorContext = createContext<InspectorContextValue | null>(null);

export function InspectorContextProvider({children}: PropsWithChildren) {
    const [_text, _setText] = useState<string>("");
    const [_tokenizerTokens, _setTokenizerTokens] = useState<Token[]>([]);

    const text = useMemo(() => _text, [_text]);
    const tokenizerTokens = useMemo(() => _tokenizerTokens, [_tokenizerTokens]);

    const setText = useMemo(() => _setText, [_setText]);
    const setTokenizerTokens = useMemo(() => _setTokenizerTokens, [_setTokenizerTokens]);

    return (
        <InspectorContext.Provider value={{
            text,
            tokenizerTokens,

            setText,
            setTokenizerTokens,
        }}>
            {children}
        </InspectorContext.Provider>
    );
}