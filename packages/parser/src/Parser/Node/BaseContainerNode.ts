import type {BaseNode} from "./BaseNode";

export interface BaseContainerNode<T extends BaseNode> extends BaseNode {
    nodes: T[];
}