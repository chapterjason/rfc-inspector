import type {BaseContentNode} from "./BaseContentNode";
import {NodeType} from "../NodeType";

export interface TextNode extends BaseContentNode {
    type: NodeType.TEXT;
    indent: number;

    /**
     * A NON multiline string.
     */
    text: string;
}