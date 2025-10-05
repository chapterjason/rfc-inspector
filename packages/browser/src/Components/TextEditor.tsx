import {Col, Row} from "react-bootstrap";
import {Editor, type Monaco} from "@monaco-editor/react";
import {editor, Selection} from "monaco-editor";
import React, {use, useCallback, useEffect, useMemo, useState} from "react";
import {registerHardWrap} from "../extensions/hard-wrap/registerHardWrap.js";
import {registerVisualizeNewline} from "../extensions/visualize-newline/registerVisualizeNewline.js";
import {registerRfcLanguage} from "../editor/registerRfcLanguage.js";
import {type Token, tokenize, TokenType} from "@rfc-inspector/tokenizer";
import {SAMPLE_TEXT} from "../sample.js";
import {InspectorContext} from "../Context/InspectorContext.js";
import {isSelected} from "../Utils/IsSelected.js";

export function TextEditor() {
    const context = use(InspectorContext);

    if (!context) {
        throw new Error('TextEditor must be used within a InspectorContextProvider.');
    }

    const {
        text,

        setText,
        setTokenizerTokens,
    } = context;

    const [selections, setSelections] = useState<Selection[]>([]);

    useEffect(() => {
        const tokens = tokenize(text);
        const isSelecting = !(
            selections.length === 1 &&
            selections[0].startLineNumber === selections[0].endLineNumber &&
            selections[0].startColumn === selections[0].endColumn
        );

        if (selections.length === 0) {
            setTokenizerTokens(Array.from(tokens));

            return;
        }

        if (isSelecting) {
            const selectedTokens: Token[] = [];

            for (const token of tokens) {
                if (token.type === TokenType.EOF) {
                    break;
                }

                if (isSelected(token, selections)) {
                    selectedTokens.push(token);
                }
            }

            setTokenizerTokens(selectedTokens);
        } else {
            setTokenizerTokens(Array.from(tokens));
            // @todo create a state for selections, so we can move the scroll position in the other editor instead of reducing
        }
    }, [text, selections, setTokenizerTokens]);

    function handleTextEditorOnMount(instance: editor.IStandaloneCodeEditor) {
        registerHardWrap(instance);
        registerVisualizeNewline(instance);

        instance.setValue(SAMPLE_TEXT);
        setText(SAMPLE_TEXT);

        // @todo dispose somehow
        instance.onDidChangeCursorSelection((event) => setSelections([event.selection, ...event.secondarySelections]));
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
                            language={"rfc-tokenizer"}
                            theme={"rfc"}
                            defaultValue={''}
                            onMount={handleTextEditorOnMount}
                            beforeMount={handleTextEditorBeforeMount}
                            onChange={handleTextEditorChange}
                            options={({
                                minimap: {
                                    enabled: false,
                                },

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

                                rulers: [
                                    {column: 72, color: '#444d56'}
                                ]
                            } as editor.IStandaloneEditorConstructionOptions)}
                        />
                    </div>
                </Col>
            </Row>
        , []);
}