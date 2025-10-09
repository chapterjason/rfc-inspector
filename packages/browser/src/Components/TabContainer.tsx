import {Col, Tab, Tabs} from "react-bootstrap";
import {TokenizerPage} from "./Pages/Tokenizer/TokenizerPage";
import {LexerPage} from "./Pages/Lexer/LexerPage";
import {ParserPage} from "./Pages/Parser/ParserPage";
import React, {useContext, useEffect} from "react";
import {InspectorContext} from "../Context/InspectorContext";

export function TabContainer() {
    const context = useContext(InspectorContext);

    if (!context) {
        throw new Error('TabContainer must be used within a InspectorContextProvider.');
    }

    const {language, setLanguage} = context;

    function handleOnSelect(key: string | null){
        switch (key ?? 'parser') {
            case "parser":
                if (language !== "rfc-parser") {
                    setLanguage("rfc-parser");
                }
                break;
            case "tokenizer":
                if (language !== "rfc-tokenizer") {
                    setLanguage("rfc-tokenizer");
                }
                break;
            case "lexer":
                if (language !== "rfc-lexer") {
                    setLanguage("rfc-lexer");
                }
                break;
        }
    }

    useEffect(() => {
        handleOnSelect('parser');
    }, []);

    return (
        <Col xs={6} className={"tabs-container"}>
            <Tabs
                defaultActiveKey="parser"
                onSelect={handleOnSelect}
                className="pt-2"
            >
                <Tab eventKey="tokenizer" title="tokenizer">
                    <TokenizerPage/>
                </Tab>
                <Tab eventKey="lexer" title="lexer">
                    <LexerPage/>
                </Tab>
                <Tab eventKey="parser" title="parser">
                    <ParserPage/>
                </Tab>
            </Tabs>
        </Col>
    );
}