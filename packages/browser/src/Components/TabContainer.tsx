import {Col, Tab, Tabs} from "react-bootstrap";
import {TokenizerPage} from "./Pages/Tokenizer/TokenizerPage";
import {LexerPage} from "./Pages/Lexer/LexerPage";
import {ParserPage} from "./Pages/Parser/ParserPage";
import React, {useContext} from "react";
import {InspectorContext} from "../Context/InspectorContext";

export function TabContainer() {
    const {language, setLanguage} = useContext(InspectorContext);

    return (
        <Col xs={6} className={"tabs-container"}>
            <Tabs
                defaultActiveKey="tokenizer"
                onSelect={(key) => {
                    switch (key) {
                        case "parser":
                        case "tokenizer":
                            if (language !== "rfc") {
                                setLanguage("rfc");
                            }
                            break;
                        case "lexer":
                            if (language !== "rfc") {
                                setLanguage("rfc");
                            }
                    }
                }}
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