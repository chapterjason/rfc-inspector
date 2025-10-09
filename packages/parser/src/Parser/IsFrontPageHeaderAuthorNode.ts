import {BaseNode} from "./Node/BaseNode";
import {FrontPageHeaderAuthorNode} from "./Node/FrontPageHeader/FrontPageHeaderAuthorNode";
import {NodeType} from "./NodeType";

export function isFrontPageHeaderAuthorNode(node: BaseNode): node is FrontPageHeaderAuthorNode {
    return node.type === NodeType.FRONT_PAGE_HEADER_AUTHOR;
}