import {BaseContentNode} from "../Node/BaseContentNode";
import {NodeType} from "../NodeType";

export function isContentNode(node: BaseContentNode): node is BaseContentNode {
    return (node as BaseContentNode).src !== undefined || (
        node.type === NodeType.TEXT
    )
}