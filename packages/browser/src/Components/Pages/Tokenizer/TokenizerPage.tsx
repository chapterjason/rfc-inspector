import {Button, ButtonGroup} from "react-bootstrap";
import React, {Fragment} from "react";
import {PageHeader} from "../../PageHeader.js";
import {JsonEditor} from "./JsonEditor.js";

export function TokenizerPage() {
    return (
        <Fragment>
            <PageHeader title={"Tokenizer - JSON"}>
                <ButtonGroup size={"sm"} className={"ms-auto"}>
                    <Button size={"sm"} variant={"secondary"}>
                        Copy JSON
                    </Button>
                </ButtonGroup>
            </PageHeader>
            <JsonEditor/>
        </Fragment>
    )
}