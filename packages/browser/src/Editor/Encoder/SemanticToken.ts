import type {Node} from "@rfc-inspector/parser";

export interface SemanticToken {
    node: Node;

    lineIndex: number;
    columnIndex: number;
    length: number;
    typeIndex: number;
    modifierIndex: number;
}