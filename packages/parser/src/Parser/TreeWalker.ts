import {FrontPageHeaderNode} from "./Node/FrontPageHeaderNode";
import {DocumentNode} from "./Node/DocumentNode";
import {NodeType} from "./NodeType";
import {Node} from "./Node";
import {ContainerNode} from "./ContainerNode";
import {ParagraphNode} from "./Node/ParagraphNode";
import {DocumentReferenceNode} from "./Node/DocumentReferenceNode";
import {FrontPageHeaderSourceNode} from "./Node/FrontPageHeader/FrontPageHeaderSourceNode";
import {FrontPageHeaderRequestForCommentsNode} from "./Node/FrontPageHeader/FrontPageHeaderRequestForCommentsNode";
import {FrontPageHeaderReferenceListingNode} from "./Node/FrontPageHeader/FrontPageHeaderReferenceListingNode";
import {FrontPageHeaderListingNode} from "./Node/FrontPageHeader/FrontPageHeaderListingNode";
import {FrontPageHeaderAuthorNode} from "./Node/FrontPageHeader/FrontPageHeaderAuthorNode";
import type {BaseNode} from "./Node/BaseNode.js";

export class TreeWalker {

    public walk(node: Node, callback: (node: Node) => void) {
        switch (node.type) {
            case NodeType.DOCUMENT:
                this.walkDocumentNode(node, callback);
                break;
            case NodeType.BLANK:
            case NodeType.TEXT:
                callback(node);
                break;
            case NodeType.PARAGRAPH:
                this.walkParagraphNode(node, callback);
                break;
            case NodeType.DOCUMENT_REFERENCE:
                this.walkDocumentReferenceNode(node, callback);
                break;
            case NodeType.FRONT_PAGE_HEADER:
                this.walkFrontPageHeader(node, callback);
                break;
            case NodeType.FRONT_PAGE_HEADER_SOURCE:
                this.walkFrontPageHeaderSource(node, callback);
                break;
            case NodeType.FRONT_PAGE_HEADER_REQUEST_FOR_COMMENTS:
                this.walkFrontPageHeaderRequestForCommentsNode(node, callback);
                break;
            case NodeType.FRONT_PAGE_HEADER_REFERENCE_LISTING:
                this.walkFrontPageHeaderReferenceListingNode(node, callback);
                break;
            case NodeType.FRONT_PAGE_HEADER_LISTING:
                this.walkFrontPageHeaderListingNode(node, callback);
                break;
            case NodeType.FRONT_PAGE_HEADER_AUTHOR:
                this.walkFrontPageHeaderAuthorNode(node, callback);
                break;
            default:
                throw new Error(`Unknown node type: ${JSON.stringify(node)}`);
        }
    }

    protected walkContainerNode(node: ContainerNode, callback: (node: Node) => void) {
        for (const child of node.nodes) {
            this.walk(child, callback);
        }
    }

    protected walkDocumentNode(node: DocumentNode, callback: (node: Node) => void) {
        callback(node);

        this.walkContainerNode(node, callback);
    }

    protected walkFrontPageHeader(node: FrontPageHeaderNode, callback: (node: Node) => void) {
        callback(node);

        this.walkContainerNode(node, callback);
    }

    protected walkParagraphNode(node: ParagraphNode, callback: (node: Node) => void) {
        callback(node);

        this.walkContainerNode(node, callback);
    }

    protected walkDocumentReferenceNode(node: DocumentReferenceNode, callback: (node: Node) => void) {
        callback(node);

        this.walk(node.text, callback);
    }

    protected walkFrontPageHeaderSource(node: FrontPageHeaderSourceNode, callback: (node: Node) => void) {
        callback(node);

        this.walk(node.text, callback);
    }

    protected walkFrontPageHeaderRequestForCommentsNode(node: FrontPageHeaderRequestForCommentsNode, callback: (node: Node) => void) {
        callback(node);

        this.walk(node.label, callback);
        this.walk(node.value, callback);
    }

    protected walkFrontPageHeaderReferenceListingNode(node: FrontPageHeaderReferenceListingNode, callback: (node: Node) => void) {
        callback(node);

        this.walk(node.key, callback);
        this.walkContainerNode(node, callback);
    }

    protected walkFrontPageHeaderListingNode(node: FrontPageHeaderListingNode, callback: (node: Node) => void) {
        callback(node);

        this.walk(node.key, callback);
        this.walkContainerNode(node, callback);
    }

    protected walkFrontPageHeaderAuthorNode(node: FrontPageHeaderAuthorNode, callback: (node: Node) => void) {
        callback(node);

        this.walk(node.name, callback);

        if (undefined !== node.affiliation) {
            this.walk(node.affiliation, callback);
        }
    }
}