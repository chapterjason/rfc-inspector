import {Col, Row} from "react-bootstrap";
import {Editor, type Monaco, useMonaco} from "@monaco-editor/react";
import {editor, IDisposable} from "monaco-editor";
import React, {use, useCallback, useEffect, useMemo, useRef} from "react";
import {registerHardWrap} from "../extensions/hard-wrap/registerHardWrap.js";
import {registerVisualizeNewline} from "../extensions/visualize-newline/registerVisualizeNewline.js";
import {registerRfcLanguage} from "../editor/registerRfcLanguage.js";
import {tokenize} from "@rfc-inspector/tokenizer";
import {Lexer} from "@rfc-inspector/lexer";
import {SAMPLE_TEXT} from "../sample.js";
import {InspectorContext} from "../Context/InspectorContext.js";
import {useEditorHighlighting} from "../Hooks/useEditorHighlighting";

const lexer = new Lexer();

export function TextEditor() {
    const context = use(InspectorContext);

    if (!context) {
        throw new Error('TextEditor must be used within a InspectorContextProvider.');
    }

    const {
        text,
        language,
        highlightedLines,

        setText,
        setTokens,
        setSelections,
        setLexemes,
    } = context;
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const disposers = useRef<IDisposable[]>([]);
    const monaco = useMonaco();

    useEditorHighlighting(editorRef.current, highlightedLines);

    useEffect(() => {
        const tokens = Array.from(tokenize(text));

        setTokens(tokens);

        const lexemes = lexer.lex(tokens);

        setLexemes(lexemes);
    }, [text, setTokens, setLexemes]);

    useEffect(() => {
        return () => {
            disposers.current.forEach(disposer => disposer.dispose());
            disposers.current = [];
        };
    }, []);

    useEffect(() => {
        const instance = editorRef.current;

        if (!instance ||!monaco) {
            return;
        }

        const model = instance.getModel();

        if (!model) {
            return;
        }

        monaco.editor.setModelLanguage(model, language);
    }, [language, editorRef.current, monaco]);

    function handleTextEditorOnMount(instance: editor.IStandaloneCodeEditor) {
        editorRef.current = instance;

        disposers.current.push(registerHardWrap(instance));
        disposers.current.push(registerVisualizeNewline(instance));

        instance.setValue(SAMPLE_TEXT);

        setText(SAMPLE_TEXT);

        // @todo dispose somehow
        disposers.current.push(instance.onDidChangeCursorSelection((event) => {
            setSelections([event.selection, ...event.secondarySelections]);
        }));
    }

    function handleTextEditorBeforeMount(monaco: Monaco) {
        registerRfcLanguage(monaco);
    }

    const handleTextEditorChange = useCallback((value: string | undefined) => {
        setText(value ?? '');
    }, []);

    return useMemo(() =>
            <Row className={"g-0"}>
                <Col>
                    <div className="input-editor-wrapper">
                        <Editor
                            height="100%"
                            language={language}
                            theme={"rfc"}
                            defaultValue={''}
                            onMount={handleTextEditorOnMount}
                            beforeMount={handleTextEditorBeforeMount}
                            onChange={handleTextEditorChange}
                            options={({
                                renderWhitespace: "all",

                                unicodeHighlight: {
                                    allowedCharacters: {
                                        '\f': true,
                                    },
                                    invisibleCharacters: true,
                                },

                                renderControlCharacters: false,
                                renderFinalNewline: "off",
                                renderLineHighlight: "none",
                                renderValidationDecorations: "on",
                                renderIndentGuides: false,

                                wordWrap: 'off',

                                trimAutoWhitespace: true,

                                tabSize: 4,
                                automaticLayout: true,

                                folding: false,

                                guides: {
                                    highlightActiveBracketPair: false,
                                    bracketPairsHorizontal: false,
                                    bracketPairs: false,
                                    indentation: false,
                                    highlightActiveIndentation: false,
                                },

                                rulers: [
                                    {column: 72, color: '#444d56'},
                                ],

                                "semanticHighlighting.enabled": true,
                            } as editor.IStandaloneEditorConstructionOptions)}
                        />
                    </div>
                </Col>
            </Row>
        , []);
}