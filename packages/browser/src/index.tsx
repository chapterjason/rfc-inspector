import React from 'react';
import {createRoot} from 'react-dom/client';
import './style/index.css';
import {Navbar} from "./Components/Navbar.js";
import {Button, ButtonGroup, Col, Container, Row, Tab, Tabs} from "react-bootstrap";
import {TokenizerPage} from "./Components/Pages/Tokenizer/TokenizerPage.js";
import {resetContext} from "kea";
import {InspectorContextProvider} from "./Context/InspectorContext.js";
import {PageHeader} from "./Components/PageHeader.js";
import {TextEditor} from "./Components/TextEditor.js";

resetContext({
    plugins: [
        // additional kea plugins
    ],
});

document.addEventListener("DOMContentLoaded", () => {
    const root = createRoot(document.getElementById('app') as Element);

    root.render(
        <div>
            <Navbar/>
            <InspectorContextProvider>
                <Container fluid className={"g-0"}>
                    <Row className={"g-0"}>
                        <Col xs={6} className={"border-end"}>
                            <PageHeader title={"RFC TEXT"}>
                                <ButtonGroup size={"sm"} className={"ms-auto me-2"}>
                                    <Button size={"sm"} variant={"secondary"}>
                                        Filter
                                    </Button>
                                </ButtonGroup>

                                <ButtonGroup size={"sm"}>
                                    <Button size={"sm"} variant={"secondary"}>
                                        Copy TXT
                                    </Button>
                                </ButtonGroup>
                            </PageHeader>
                            <TextEditor/>
                        </Col>
                        <Col xs={6} className={"tabs-container"}>
                            <Tabs
                                defaultActiveKey="tokenizer"
                                className="pt-2"
                            >
                                <Tab eventKey="tokenizer" title="tokenizer">
                                    <TokenizerPage/>
                                </Tab>
                                <Tab eventKey="lexer" title="lexer">
                                    Tab content for Profile
                                </Tab>
                                <Tab eventKey="parser" title="parser">
                                    Tab content for Contact
                                </Tab>
                            </Tabs>
                        </Col>
                    </Row>
                </Container>
            </InspectorContextProvider>
        </div>
    );
});

/*
document.addEventListener("DOMContentLoaded", (event) => {
    return;
    const tokenizer = new Tokenizer();
    let tokens: Token[] = [];
    let lineToTokenIndexes: Map<number, number> = new Map();
    let tokenToLineIndexes: Map<number, number> = new Map();
    let jsonIndexes: IndexResult = {
        text: '',
        lines: new Uint32Array(0),
    };

    const model = monaco.editor.createModel(SAMPLE_TEXT, "rfc", monaco.Uri.parse('a://b/rfc.txt'));
    const jsonModel = monaco.editor.createModel("[]", "json", monaco.Uri.parse('a://b/rfc.json'));

    let isLoading = false;
    let loadingRequested = false;

    function doLoadData() {
        if (isLoading) {
            loadingRequested = true;
            return;
        }

        isLoading = true;

        tokens = tokenizer.tokenize(model.getValue());
        [lineToTokenIndexes, tokenToLineIndexes] = buildIndex(tokens);
        jsonIndexes = stringifyIndex(tokens);

        setTimeout(() => jsonModel.setValue(jsonIndexes.text), 0);

        const position = editor.getPosition();

        if (position) {
            setTimeout(() => changeCursor(position.lineNumber, position.column), 0);
        }

        isLoading = false;

        if (loadingRequested) {
            loadingRequested = false;
            loadData();
        }
    }

    let loadTimeout: any = undefined;

    function loadData() {
        if (loadTimeout) {
            clearTimeout(loadTimeout);
        }

        loadTimeout = setTimeout(() => {
            doLoadData();
        }, 1);
    }

    loadData();

    const editor = monaco.editor.create(
        document.getElementById('tokenizer-output')!,
        {
            model,
            language: 'rfc',
            theme: 'rfc-tokenizer',
            renderWhitespace: "all",

            renderControlCharacters: false,
            renderFinalNewline: "off",
            renderLineHighlight: "none",
            renderValidationDecorations: "on",

            wordWrap: 'off',

            trimAutoWhitespace: true,

            tabSize: 4,
            automaticLayout: true,

            rulers: [
                {column: 72, color: '#444d56'}
            ]
        }
    );

    const editorDecorations = editor.createDecorationsCollection();

    editor.onDidChangeModelContent(() => loadData());

    registerHardWrap(editor);
    registerVisualizeNewline(editor);

    const jsonEditor = monaco.editor.create(
        document.getElementById('tokenizer-json')!,
        {
            model: jsonModel,
            language: 'json',
            theme: 'rfc-tokenizer',
            renderWhitespace: "none",
            insertSpaces: true,
            tabSize: 2,
            automaticLayout: true,

            renderControlCharacters: false,
            renderFinalNewline: "off",
            renderLineHighlight: "none",
            renderValidationDecorations: "on",
        },
    );

    // map from line number to token index

    const decoration = jsonEditor.createDecorationsCollection();

    function onCursorChanged(lineNumber: number, column: number) {
        const lineIndex = lineNumber - 1;

        if (!lineToTokenIndexes.has(lineIndex)) {
            console.warn('no token on this line');
            return;
        }

        const columnIndex = column - 1;

        const currentLineIndex = lineToTokenIndexes.get(lineIndex)!;
        const nextLineIndex = lineToTokenIndexes.get(lineIndex + 1) ?? tokens.length;

        const tokensOnLine = tokens.slice(currentLineIndex, nextLineIndex);
        const offset = tokensOnLine[0].startIndex;

        let token = tokensOnLine.find(token => {
            return token.startIndex - offset <= columnIndex && columnIndex < token.endIndex - offset;
        });

        if (!token) {
            const lastToken = tokensOnLine[tokensOnLine.length - 1];

            if (lastToken.endIndex - offset <= columnIndex) {
                token = lastToken;
            }
        }

        const tokenIndex = tokens.indexOf(token!);

        if (-1 === tokenIndex) {
            console.warn('tokenIndex not found', tokensOnLine);
            return;
        }

        const line = jsonIndexes.lines[tokenIndex];

        if (line === undefined) {
            console.warn('line not found', tokenIndex);
            return;
        }

        // we need to determine the column width of the json line
        const jsonLine = jsonIndexes.text.split('\n')[line - 1];
        const range = new monaco.Range(line, 1, line, jsonLine.length + 1);

        decoration.set([
            {
                range,
                options: {
                    isWholeLine: true,
                    inlineClassName: 'highlight-selected',
                }
            }
        ]);

        jsonEditor.revealLineInCenter(line, monaco.editor.ScrollType.Smooth);
    }

    let cursorChangeTimeout: any = undefined;

    function changeCursor(lineNumber: number, column: number) {
        if (cursorChangeTimeout) {
            clearTimeout(cursorChangeTimeout);
        }

        cursorChangeTimeout = setTimeout(() => {
            cursorChangeTimeout = undefined;
            onCursorChanged(lineNumber, column);
        }, 0);
    }

    editor.onDidChangeCursorPosition((event) => {
        const {position} = event;
        const {lineNumber, column} = position;

        changeCursor(lineNumber, column);
    });

    jsonEditor.onDidChangeCursorPosition((event) => {
        const {position} = event;
        const {lineNumber, column} = position;

        const tokenIndex = lineNumber - 2; // first one is "[", second is to from 1-based to 0-based
        const line = tokenToLineIndexes.get(tokenIndex);

        if (line === undefined) {
            return;
        }

        const currentLineIndex = lineToTokenIndexes.get(line)!;
        const nextLineIndex = lineToTokenIndexes.get(line + 1) ?? tokens.length;
        const tokensOnLine = tokens.slice(currentLineIndex, nextLineIndex);
        const offset = tokensOnLine[0].startIndex;
        const token = tokens[tokenIndex];

        const range = new monaco.Range(
            line + 1, // 0-based to 1-based
            token.startIndex - offset + 1,
            line + 1, // 0-based to 1-based
            token.endIndex - offset + 1,
        );

        editorDecorations.set([{
            range,
            options: {
                isWholeLine: tokensOnLine.length === 1 && token.type === TokenType.NEWLINE,
                inlineClassName: 'highlight-selected',
            }
        }]);

        editor.revealLineInCenter(line + 1, monaco.editor.ScrollType.Smooth);
    });
});
 */