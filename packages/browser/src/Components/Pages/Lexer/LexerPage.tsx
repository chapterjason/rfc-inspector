import {Button, ButtonGroup} from "react-bootstrap";
import React, {Fragment} from "react";
import {PageHeader} from "../../PageHeader.js";
import {LexerReadonlyEditor} from "./LexerReadonlyEditor";

export function LexerPage() {
    return (
        <Fragment>
            <PageHeader title={"Lexer - JSON"}>
                <ButtonGroup size={"sm"} className={"ms-auto"}>
                    <Button size={"sm"} variant={"secondary"}>
                        Copy JSON
                    </Button>
                </ButtonGroup>
            </PageHeader>
            <LexerReadonlyEditor/>
        </Fragment>
    )
}