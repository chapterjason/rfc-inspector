import type {ParametersRecord} from "@rfc-inspector/common";

export interface LexerParametersRecord extends ParametersRecord {
    hasMetadata: boolean;
    hasTitle: boolean;
    isInTableOfContents: boolean;
}