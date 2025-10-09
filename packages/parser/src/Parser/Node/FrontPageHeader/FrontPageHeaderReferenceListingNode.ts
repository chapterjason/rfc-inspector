import {BaseContainerNode} from "../BaseContainerNode";
import {NodeType} from "../../NodeType";
import type {TextNode} from "../TextNode";
import {DocumentReferenceNode} from "../DocumentReferenceNode";

export interface FrontPageHeaderReferenceListingNode extends BaseContainerNode<DocumentReferenceNode> {
    type: NodeType.FRONT_PAGE_HEADER_REFERENCE_LISTING;
    key: TextNode;
}