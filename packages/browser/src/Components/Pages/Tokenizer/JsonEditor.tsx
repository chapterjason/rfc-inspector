import {Col, Row} from "react-bootstrap";
import {Editor} from "@monaco-editor/react";
import {editor} from "monaco-editor";
import React, {use, useDeferredValue, useEffect, useMemo, useRef} from "react";
import {InspectorContext} from "../../../Context/InspectorContext.js";
import {stringifyCompact} from "@rfc-inspector/common";

export function JsonEditor() {
    const context = use(InspectorContext);

    if (!context) {
        throw new Error('JsonEditor must be used within a InspectorContextProvider.');
    }

    const {tokenizerTokens} = context;
    const deferredTokenizerTokens = useDeferredValue(tokenizerTokens, []);
    const ref = useRef<editor.IStandaloneCodeEditor | null>(null);

    function handleJsonEditorBeforeMount() {
        //registerRfcLanguage(monaco, tokenizer);
    }

    function handleJsonEditorOnMount(instance: editor.IStandaloneCodeEditor) {
        ref.current = instance;
    }

    useEffect(() => {
        if (!ref.current) {
            return;
        }

        const model = ref.current.getModel();

        if (!model) {
            return;
        }

        model.setValue(stringifyCompact(deferredTokenizerTokens));
        ref.current.revealLine(1, editor.ScrollType.Smooth);
    }, [deferredTokenizerTokens, ref]);

    return useMemo(() => (
            <Row className={"g-0"}>
                <Col>
                    <div className="output-editor-wrapper">
                        <Editor
                            height="100%"
                            language={"json"}
                            theme={"rfc"}
                            keepCurrentModel={true}
                            defaultValue={'[]'}
                            beforeMount={handleJsonEditorBeforeMount}
                            onMount={handleJsonEditorOnMount}
                            options={({
                                minimap: {
                                    enabled: false,
                                },

                                folding: false,
                                wordWrap: "off",

                                renderWhitespace: "none",
                                unicodeHighlight: "off",
                                renderControlCharacters: false,
                                renderFinalNewline: "off",
                                renderLineHighlight: "none",
                                renderValidationDecorations: "on",
                                readOnly: true,
                                tabSize: 4,
                                automaticLayout: true,
                            } as editor.IStandaloneEditorConstructionOptions)}
                        />
                    </div>
                </Col>
            </Row>
        ), []);
}