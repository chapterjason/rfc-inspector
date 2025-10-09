import {Button, ButtonGroup} from "react-bootstrap";
import React, {Fragment} from "react";
import {PageHeader} from "../../PageHeader.js";
import {ParserReadonlyEditor} from "./ParserReadonlyEditor.js";

export function ParserPage() {
    return (
        <Fragment>
            <PageHeader title={"Parser - JSON"}>
                <ButtonGroup size={"sm"} className={"ms-auto"}>
                    <Button size={"sm"} variant={"secondary"}>
                        Copy JSON
                    </Button>
                </ButtonGroup>
            </PageHeader>
            <ParserReadonlyEditor/>
        </Fragment>
    )
}