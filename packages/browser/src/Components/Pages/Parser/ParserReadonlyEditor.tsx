import {Col, Row} from "react-bootstrap";
import {Editor, Monaco} from "@monaco-editor/react";
import {editor, IDisposable} from "monaco-editor";
import React, {use, useDeferredValue, useEffect, useMemo, useRef} from "react";
import {InspectorContext} from "../../../Context/InspectorContext.js";
import {registerRfcLanguage} from "../../../Editor/RegisterRfcLanguage.js";

export function ParserReadonlyEditor() {
    const context = use(InspectorContext);

    if (!context) {
        throw new Error('ParserReadonlyEditor must be used within a InspectorContextProvider.');
    }

    const {
        document,
    } = context;

    const deferredDocument = useDeferredValue(document, null);

    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const disposers = useRef<IDisposable[]>([]);

    useEffect(() => {
        return () => {
            disposers.current.forEach(disposer => disposer.dispose());
            disposers.current = [];
        };
    }, []);

    useEffect(() => {
        const instance = editorRef.current;

        if (!instance) {
            return;
        }

        const model = instance.getModel();

        if (!model) {
            return;
        }

        if (!deferredDocument) {
            model.setValue('{}');
            return;
        }

        model.setValue(JSON.stringify(deferredDocument, null, 2));
    }, [deferredDocument]);

    function handleJsonEditorBeforeMount(monaco: Monaco) {
        registerRfcLanguage(monaco);
    }

    function handleJsonEditorOnMount(instance: editor.IStandaloneCodeEditor) {
        editorRef.current = instance;
    }

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