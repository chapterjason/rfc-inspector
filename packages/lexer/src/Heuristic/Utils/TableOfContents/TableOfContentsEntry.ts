import {DataLineToken} from "@rfc-inspector/tokenizer";

export interface TableOfContentsEntry {
    numbering?: string;
    title: string;
    pageNumber?: string;

    sub?: TableOfContentsEntry[];
    tokens: DataLineToken[];
}