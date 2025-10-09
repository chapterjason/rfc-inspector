import type {BaseContainerNode} from "./BaseContainerNode";
import {NodeType} from "../NodeType.js";
import type {Node} from "../Node.js";

export interface DocumentNode extends BaseContainerNode<Node> {
    type: NodeType.DOCUMENT;
}