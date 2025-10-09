import type {BaseNode} from "../BaseNode";
import type {TextNode} from "../TextNode";
import {NodeType} from "../../NodeType";

export interface FrontPageHeaderSourceNode extends BaseNode {
    type: NodeType.FRONT_PAGE_HEADER_SOURCE;
    text: TextNode;
}