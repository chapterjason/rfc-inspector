import type {ParametersRecord} from "@rfc-inspector/common";
import type {TableOfContentsEntry} from "./Utils/TableOfContents/TableOfContentsEntry.js";

export interface LexerParametersRecord extends ParametersRecord {
    hasMetadata: boolean;
    hasTitle: boolean;
    isInTableOfContents: boolean;
    tableOfContents: TableOfContentsEntry[];
}