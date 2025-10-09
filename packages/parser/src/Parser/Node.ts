import {DocumentNode} from "./Node/DocumentNode";
import {BlankLineNode} from "./Node/BlankLineNode";
import {TextNode} from "./Node/TextNode";
import {ParagraphNode} from "./Node/ParagraphNode";
import {DocumentReferenceNode} from "./Node/DocumentReferenceNode";
import {FrontPageHeaderNode} from "./Node/FrontPageHeaderNode";
import {FrontPageHeaderSourceNode} from "./Node/FrontPageHeader/FrontPageHeaderSourceNode";
import {FrontPageHeaderRequestForCommentsNode} from "./Node/FrontPageHeader/FrontPageHeaderRequestForCommentsNode";
import {FrontPageHeaderReferenceListingNode} from "./Node/FrontPageHeader/FrontPageHeaderReferenceListingNode";
import {FrontPageHeaderListingNode} from "./Node/FrontPageHeader/FrontPageHeaderListingNode";
import {FrontPageHeaderAuthorNode} from "./Node/FrontPageHeader/FrontPageHeaderAuthorNode";

export type Node =
    DocumentNode |
    BlankLineNode |
    TextNode |
    ParagraphNode |
    DocumentReferenceNode |
    FrontPageHeaderNode |
    FrontPageHeaderSourceNode |
    FrontPageHeaderRequestForCommentsNode |
    FrontPageHeaderReferenceListingNode |
    FrontPageHeaderListingNode |
    FrontPageHeaderAuthorNode
    ;