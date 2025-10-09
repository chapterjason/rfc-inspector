import type {BaseNode} from "../BaseNode";
import type {TextNode} from "../TextNode";
import {DocumentReferenceNode} from "../DocumentReferenceNode";
import {NodeType} from "../../NodeType";

export interface FrontPageHeaderRequestForCommentsNode extends BaseNode {
    type: NodeType.FRONT_PAGE_HEADER_REQUEST_FOR_COMMENTS;
    label: TextNode;
    value: DocumentReferenceNode;
}