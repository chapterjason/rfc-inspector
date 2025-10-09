import {DocumentNode} from "./Node/DocumentNode";
import {ParagraphNode} from "./Node/ParagraphNode";
import {FrontPageHeaderNode} from "./Node/FrontPageHeaderNode";
import {FrontPageHeaderListingNode} from "./Node/FrontPageHeader/FrontPageHeaderListingNode";
import {FrontPageHeaderReferenceListingNode} from "./Node/FrontPageHeader/FrontPageHeaderReferenceListingNode";

export type ContainerNode = DocumentNode |
    ParagraphNode |
    FrontPageHeaderNode |
    FrontPageHeaderListingNode |
    FrontPageHeaderReferenceListingNode
    ;