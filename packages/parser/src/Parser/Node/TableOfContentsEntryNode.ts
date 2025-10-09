import type {TextNode} from "./TextNode.js";
import type {BaseNode} from "./BaseNode";
import {NodeType} from "../NodeType";

/**
 * @todo what about multiline entries?
 */
export interface TableOfContentsEntryNode extends BaseNode {
    type: NodeType.TABLE_OF_CONTENTS_ENTRY;
    numbering?: TextNode;
    text: TextNode;
    spacing?: TextNode;
    pageNumber?: TextNode;
}