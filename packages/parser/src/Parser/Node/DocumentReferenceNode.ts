import type {BaseNode} from "./BaseNode";
import type {TextNode} from "./TextNode";
import {NodeType} from "../NodeType";

export interface DocumentReferenceNode extends BaseNode {
    type: NodeType.DOCUMENT_REFERENCE;
    id: number;
    text: TextNode;
}