import type {TextNode} from "../TextNode.js";
import type {BaseNode} from "../BaseNode.js";
import {NodeType} from "../../NodeType.js";

export interface FrontPageHeaderAuthorNode extends BaseNode {
    type: NodeType.FRONT_PAGE_HEADER_AUTHOR;
    name: TextNode;
    affiliation?: TextNode;
}