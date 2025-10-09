import {Col, Row} from "react-bootstrap";
import {Editor, type Monaco, useMonaco} from "@monaco-editor/react";
import {editor, IDisposable, Range} from "monaco-editor";
import React, {use, useCallback, useEffect, useMemo, useRef} from "react";
import {registerVisualizeNewline} from "../Editor/Extensions/VisualizeNewline/RegisterVisualizeNewline.js";
import {registerRfcLanguage} from "../Editor/RegisterRfcLanguage.js";
import {tokenize, TokenType} from "@rfc-inspector/tokenizer";
import {Lexer} from "@rfc-inspector/lexer";
import {SAMPLE_TEXT} from "../sample.js";
import {InspectorContext} from "../Context/InspectorContext.js";
import {useEditorHighlighting} from "../Hooks/useEditorHighlighting";
import {useEditorDecorations} from "../Hooks/useEditorDecorations";
import {parse} from "@rfc-inspector/parser";
import {normalizeType} from "../Utils/NormalizeType.js";

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
        setDocument,
    } = context;
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const disposers = useRef<IDisposable[]>([]);
    const monaco = useMonaco();

    useEditorHighlighting(editorRef.current, highlightedLines);
    const decorationsRef = useEditorDecorations(editorRef.current);

    useEffect(() => {
        const tokens = Array.from(tokenize(text));

        setTokens(tokens);

        const lexemes = lexer.lex(tokens);

        setLexemes(lexemes);

        try {
            const document = parse(lexemes);

            setDocument(document);
        } catch (e) {
            console.log(e);
        }
    }, [text, setTokens, setLexemes]);

    useEffect(() => {
        const instance = editorRef.current;
        const decorationsCollection = decorationsRef.current;

        if (!instance || !decorationsCollection) {
            return;
        }

        const model = instance.getModel();
        if (!model) {
            return;
        }

        const apply = () => {
            if (model.getLanguageId() !== "rfc-tokenizer") {
                decorationsCollection.set([]);
                return;
            }

            const tokens = Array.from(tokenize(text));

            const lines = new Map<number, string>();

            for (const token of tokens) {
                if (token.type === TokenType.EOF) {
                    break;
                }

                lines.set(token.line, "rfc-token-" + normalizeType(TokenType[token.type]));
            }

            const decorations = Array.from(lines.entries())
                .map(([line, className]) => ({
                    range: new Range(line, 1, line, 1),
                    options: {
                        isWholeLine: true,
                        className,
                        stickiness: editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
                    }
                } as editor.IModelDeltaDecoration));

            decorationsCollection.set(decorations);
        };

        apply();

        const sub1 = model.onDidChangeContent(apply);
        const sub2 = instance.onDidChangeModelLanguage(apply);

        return () => {
            sub1.dispose();
            sub2.dispose();
            decorationsCollection.set([]); // clear on unmount
        };
    }, [text, editorRef.current, decorationsRef.current]);

    useEffect(() => {
        return () => {
            disposers.current.forEach(disposer => disposer.dispose());
            disposers.current = [];
        };
    }, []);

    useEffect(() => {
        const instance = editorRef.current;

        if (!instance || !monaco) {
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

        disposers.current.push(registerVisualizeNewline(instance));

        instance.setValue(SAMPLE_TEXT);

        setText(SAMPLE_TEXT);

        // @todo dispose somehow
        disposers.current.push(instance.onDidChangeCursorSelection((event) => {
            setSelections([event.selection, ...event.secondarySelections]);
        }));

        const model = instance.getModel();

        if (!model) {
            throw new Error("No model");
        }

        disposers.current.push(model.onDidChangeContent(() => {
            if (!model._rfc){
                model._rfc = {};
            }

            model._rfc.needsUpdate = true;
        }));

        model.onWillDispose(() => {
            delete model._rfc;
        });
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
                            keepCurrentModel={true}
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