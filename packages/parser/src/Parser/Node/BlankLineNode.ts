import {NodeType} from "../NodeType.js";
import type {BaseNode} from "./BaseNode";

export interface BlankLineNode extends BaseNode {
    type: NodeType.BLANK;
}