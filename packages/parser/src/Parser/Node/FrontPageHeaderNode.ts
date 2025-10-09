import {BaseContainerNode} from "./BaseContainerNode";
import {NodeType} from "../NodeType";
import {FrontPageHeaderSourceNode} from "./FrontPageHeader/FrontPageHeaderSourceNode";
import {FrontPageHeaderRequestForCommentsNode} from "./FrontPageHeader/FrontPageHeaderRequestForCommentsNode";
import {FrontPageHeaderReferenceListingNode} from "./FrontPageHeader/FrontPageHeaderReferenceListingNode";
import {FrontPageHeaderListingNode} from "./FrontPageHeader/FrontPageHeaderListingNode";
import {FrontPageHeaderAuthorNode} from "./FrontPageHeader/FrontPageHeaderAuthorNode";

export interface FrontPageHeaderNode extends BaseContainerNode<FrontPageHeaderSourceNode |
    FrontPageHeaderRequestForCommentsNode |
    FrontPageHeaderReferenceListingNode |
    FrontPageHeaderListingNode |
    FrontPageHeaderAuthorNode> {
    type: NodeType.FRONT_PAGE_HEADER;
}