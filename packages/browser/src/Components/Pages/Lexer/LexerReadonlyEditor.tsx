import {Col, Row} from "react-bootstrap";
import {Editor, Monaco} from "@monaco-editor/react";
import {editor, IDisposable, Selection} from "monaco-editor";
import React, {use, useDeferredValue, useEffect, useMemo, useRef} from "react";
import {InspectorContext} from "../../../Context/InspectorContext.js";
import {stringifyCompact} from "@rfc-inspector/common";
import {expandSelection} from "../../../Utils/ExpandSelection";
import {uniqueArrayFilter} from "../../../Utils/UniqueArrayFilter";
import {registerRfcLanguage} from "../../../Editor/RegisterRfcLanguage.js";
import {Lexeme, LexemeLine, LexemeType} from "@rfc-inspector/lexer";
import {useEditorHighlighting} from "../../../Hooks/useEditorHighlighting";
import {isSelected} from "../../../Utils/IsSelected";

export function getSelectedLexemes(lexemes: Lexeme[], selections: Selection[]): LexemeLine[] {
    const selectedLexemes: LexemeLine[] = [];

    for (const lexeme of lexemes) {
        if (lexeme.type === LexemeType.EOF) {
            break;
        }

        if (isSelected(lexeme, selections)) {
            selectedLexemes.push(lexeme);
        }
    }

    return selectedLexemes;
}

export function LexerReadonlyEditor() {
    const context = use(InspectorContext);

    if (!context) {
        throw new Error('LexerReadonlyEditor must be used within a InspectorContextProvider.');
    }

    const {
        lexemes,
        selections,
        setHighlightedLines
    } = context;

    const deferredLexemes = useDeferredValue(lexemes, []);
    const deferredSelections = useDeferredValue(selections, []);

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

        model.setValue(stringifyCompact(deferredLexemes));
    }, [deferredLexemes]);

    const lines = useMemo(() => {
        const selectedTokens = getSelectedLexemes(deferredLexemes, deferredSelections);

        // +1 for offset from "[" in first line
        return selectedTokens.map(token => token.line + 1);
    }, [deferredLexemes, deferredSelections]);

    useEditorHighlighting(editorRef.current, lines);

    function handleJsonEditorBeforeMount(monaco: Monaco) {
        registerRfcLanguage(monaco);
    }

    function handleJsonEditorOnMount(instance: editor.IStandaloneCodeEditor) {
        editorRef.current = instance;

        disposers.current.push(instance.onDidChangeCursorSelection((event) => {
            if (event.source === "model") {
                return;
            }

            const lines = [
                    ...expandSelection(event.selection),
                    ...event.secondarySelections.map(expandSelection).flat(),
                ]
                    .filter(uniqueArrayFilter)
                    .sort((a, b) => a - b)
                    .map(line => line - 1)
            ;

            setHighlightedLines(lines);
        }));
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