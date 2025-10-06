import React, {createContext, type PropsWithChildren, useMemo, useState} from "react";
import type {Token} from "@rfc-inspector/tokenizer";
import {Selection} from "monaco-editor";
import {Lexeme} from "@rfc-inspector/lexer";

export interface InspectorContextValue {
    text: string;
    language: string;
    highlightedLines: number[];
    tokens: Token[];
    lexemes: Lexeme[];
    selections: Selection[];


    setText: (text: string) => void;
    setLanguage: (language: string) => void;
    setHighlightedLines: (lines: number[]) => void;
    setTokens: (tokens: Token[]) => void;
    setLexemes: (lexemes: Lexeme[]) => void;
    setSelections: (selections: Selection[]) => void;
}

export const InspectorContext = createContext<InspectorContextValue | null>(null);

export function InspectorContextProvider({children}: PropsWithChildren) {
    const [_text, _setText] = useState<string>("");
    const [_language, _setLanguage] = useState<string>("rfc");
    const [_highlightedLines, _setHighlightedLines] = useState<number[]>([]);
    const [_tokens, _setTokens] = useState<Token[]>([]);
    const [_lexemes, _setLexemes] = useState<Lexeme[]>([]);
    const [_selections, _setSelections] = useState<Selection[]>([]);

    const text = useMemo(() => _text, [_text]);
    const language = useMemo(() => _language, [_language]);
    const highlightedLines = useMemo(() => _highlightedLines, [_highlightedLines]);
    const tokens = useMemo(() => _tokens, [_tokens]);
    const lexemes = useMemo(() => _lexemes, [_lexemes]);
    const selections = useMemo(() => _selections, [_selections]);

    const setText = useMemo(() => _setText, [_setText]);
    const setLanguage = useMemo(() => _setLanguage, [_setLanguage]);
    const setHighlightedLines = useMemo(() => _setHighlightedLines, [_setHighlightedLines]);
    const setTokens = useMemo(() => _setTokens, [_setTokens]);
    const setLexemes = useMemo(() => _setLexemes, [_setLexemes]);
    const setSelections = useMemo(() => _setSelections, [_setSelections]);

    return (
        <InspectorContext.Provider value={{
            text,
            language,
            highlightedLines,
            tokens,
            lexemes,
            selections,

            setText,
            setLanguage,
            setHighlightedLines,
            setTokens,
            setLexemes,
            setSelections,
        }}>
            {children}
        </InspectorContext.Provider>
    );
}