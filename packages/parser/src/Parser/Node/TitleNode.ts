import type {TextNode} from "./TextNode.js";
import type {BaseNode} from "./BaseNode";
import {NodeType} from "../NodeType";

export interface TitleNode extends BaseNode {
    type: NodeType.TITLE;
    text: TextNode;
}