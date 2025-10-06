import {Navbar} from "./Navbar";
import {InspectorContextProvider} from "../Context/InspectorContext";
import {Button, ButtonGroup, Col, Container, Row} from "react-bootstrap";
import {PageHeader} from "./PageHeader";
import {TextEditor} from "./TextEditor";
import React from "react";
import {TabContainer} from "./TabContainer.js";


export function App() {
    return (
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
                        <TabContainer/>
                    </Row>
                </Container>
            </InspectorContextProvider>
        </div>
    );
}