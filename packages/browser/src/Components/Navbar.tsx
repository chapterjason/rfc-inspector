import {
    Button,
    ButtonGroup,
    ButtonToolbar,
    Container,
    Dropdown,
    Form,
    InputGroup,
    Navbar as BootstrapNavbar
} from "react-bootstrap";
import React from "react";

export function Navbar() {
    return (
        <BootstrapNavbar expand={"lg"} className={"bg-body-tertiary"}>
            <Container fluid>
                <BootstrapNavbar.Brand href="/">RFC-Inspector</BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav"/>
                <BootstrapNavbar.Collapse id="basic-navbar-nav">
                    <ButtonToolbar className={"ms-auto"}>
                        <ButtonGroup size={"sm"} className={"ms-auto me-auto ms-lg-auto me-lg-2"}>
                            <InputGroup>
                                <Form.Control size={"sm"} type="url" placeholder="https://[...]/rfc6749.txt"/>
                                <Button size={"sm"} variant={"outline-primary"}>From URL</Button>
                            </InputGroup>
                        </ButtonGroup>

                        <ButtonGroup size={"sm"} className={"ms-auto me-auto ms-lg-auto me-lg-2"}>
                            <Dropdown>
                                <Dropdown.Toggle size={"sm"} variant="secondary">
                                    Load From
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item href="#">JSON</Dropdown.Item>
                                    <Dropdown.Item href="#">TXT</Dropdown.Item>
                                    <Dropdown.Divider/>
                                    <Dropdown.Item href="#">JSON Clipboard</Dropdown.Item>
                                    <Dropdown.Item href="#">TXT Clipboard</Dropdown.Item>
                                    <Dropdown.Divider/>
                                    <Dropdown.Item href="#">JSON File</Dropdown.Item>
                                    <Dropdown.Item href="#">TXT File</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </ButtonGroup>
                        <ButtonGroup size={"sm"} className={"ms-auto me-auto"}>
                            <Button size={"sm"} variant={"secondary"}>Load Sample</Button>
                            <Button size={"sm"} variant={"secondary"}>Clear</Button>
                        </ButtonGroup>
                    </ButtonToolbar>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    )
}