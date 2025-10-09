import type {BaseContainerNode} from "./BaseContainerNode";
import {NodeType} from "../NodeType";
import {TableOfContentsEntryNode} from "./TableOfContentsEntryNode";

export interface TableOfContentsNode extends BaseContainerNode<TableOfContentsEntryNode> {
    type: NodeType.TABLE_OF_CONTENTS;
}