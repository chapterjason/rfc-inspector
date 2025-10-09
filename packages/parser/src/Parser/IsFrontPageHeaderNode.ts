import {BaseNode} from "./Node/BaseNode";
import {FrontPageHeaderNode} from "./Node/FrontPageHeaderNode";
import {NodeType} from "./NodeType";

export function isFrontPageHeaderNode(node: BaseNode): node is FrontPageHeaderNode {
    return node.type === NodeType.FRONT_PAGE_HEADER;
}