import type {TextNode} from "./TextNode.js";
import type {BaseNode} from "./BaseNode";
import {NodeType} from "../NodeType";

export interface SectionTitleNode extends BaseNode {
    type: NodeType.SECTION_TITLE;
    numbering?: TextNode;
    text: TextNode;
}