import {BaseContainerNode} from "../BaseContainerNode";
import type {TextNode} from "../TextNode";
import {NodeType} from "../../NodeType";

export interface FrontPageHeaderListingNode extends BaseContainerNode<TextNode> {
    type: NodeType.FRONT_PAGE_HEADER_LISTING;
    key: TextNode;
}

