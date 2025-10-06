import {editor} from "monaco-editor";

export function scrollToLines(instance: editor.IStandaloneCodeEditor, selectedLines: number[]) {
    if (selectedLines.length === 0) {
        return;
    }

    const sorted = [...selectedLines].sort((a, b) => a - b);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const isContiguous = sorted.every((n, i) => i === 0 || n - sorted[i - 1] === 1);

    const targetLine = isContiguous
        ? Math.round((first + last) / 2) // middle of block
        : first; // first selection if scattered

    instance.revealLineInCenter(targetLine);
}