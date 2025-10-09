import type {BaseNode} from "./BaseNode";
import {SourceReference} from "./SourceReference";

export interface BaseContentNode extends BaseNode {
    src?: SourceReference;
}