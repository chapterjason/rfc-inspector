import {Node, NodeType} from "@rfc-inspector/parser";
import {hasTypeProperty} from "./HasTypeProperty.js";
import {normalizeType} from "./NormalizeType.js";

export function getNodeType(node: Node | NodeType): string {
    if (hasTypeProperty(node)) {
        return getNodeType(node.type);
    }

    return 'rfc-node-' + normalizeType(NodeType[node]);
}