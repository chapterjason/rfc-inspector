import {Selection} from "monaco-editor";

export function expandSelection(selection: Selection): number[] {
    if (selection.startLineNumber === selection.endLineNumber) {
        return [selection.startLineNumber];
    }

    const lines: number[] = [];

    for (let line = selection.startLineNumber; line <= selection.endLineNumber; line++) {
        lines.push(line);
    }

    return lines;
}