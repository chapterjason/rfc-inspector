import type {BaseContainerNode} from "./BaseContainerNode";
import {NodeType} from "../NodeType";
import {TextNode} from "./TextNode";

export interface ParagraphNode extends BaseContainerNode<TextNode> {
    type: NodeType.PARAGRAPH;
}