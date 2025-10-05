import React, {type PropsWithChildren} from "react";
import {ButtonToolbar, Col, Row} from "react-bootstrap";

import type {PageHeaderProps} from "./PageHeaderProps.js";

export function PageHeader(props: PropsWithChildren<PageHeaderProps>) {
    const {title, children} = props;

    return (
        <Row className={"g-0"}>
            <Col>
                <Row className={"g-0"}>
                    <Col className={"border-bottom d-flex align-items-center"}>
                        <div className="p-2">
                            <strong>{title}</strong>
                        </div>
                    </Col>
                    <Col className={"border-bottom"}>
                        <div className="p-2">
                            <ButtonToolbar>
                                {children}
                            </ButtonToolbar>
                        </div>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}