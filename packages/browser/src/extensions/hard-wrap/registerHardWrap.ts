import * as monaco from "monaco-editor";
import {isWS} from "./isWS.js";
import {lastWS} from "./lastWS.js";

export function registerHardWrap(editor: monaco.editor.IStandaloneCodeEditor, HARD_WRAP_COL = 72) {
    let busy = false;

    function onChange() {
        if (busy) {
            return;
        }
        const model = editor.getModel();

        if (!model) {
            return;
        }

        const pos = editor.getPosition();
        if (!pos) {
            return;
        }

        const n = pos.lineNumber;
        const text = model.getLineContent(n);
        if (text.length <= HARD_WRAP_COL) {
            return;
        }

        // Identify the current word around the caret (column is 1-based).
        const idx = Math.max(0, Math.min(text.length, pos.column - 1));
        let wsL = idx - 1;
        while (wsL >= 0 && !isWS(text[wsL])) {
            wsL--;
        }
        const wordStart = wsL + 1;

        let wsR = idx;
        while (wsR < text.length && !isWS(text[wsR])) {
            wsR++;
        }
        const wordEnd = wsR; // exclusive

        const indent = (text.match(/^\s*/)?.[0]) ?? '';

        // Case 1: word crosses the limit → move the whole word to next line.
        if (wordStart <= HARD_WRAP_COL && HARD_WRAP_COL < wordEnd) {
            const left = text.slice(0, wordStart).replace(/\s+$/, '');
            const word = text.slice(wordStart, wordEnd);
            const right = text.slice(wordEnd); // includes following space/text as-is

            const range = new monaco.Range(n, 1, n, model.getLineMaxColumn(n));
            const newText = `${left}\n${indent}${word}${right}`;

            const newCaretCol = indent.length + word.length + 1; // after moved word
            const caret = new monaco.Selection(n + 1, newCaretCol, n + 1, newCaretCol);

            busy = true;
            try {
                editor.executeEdits('hard-wrap', [{range, text: newText}], [caret]);
            } finally {
                busy = false;
            }
            return;
        }

        // Case 2: no crossing → wrap at last whitespace ≤ limit.
        const splitAt = lastWS(text, HARD_WRAP_COL);
        if (splitAt >= 0) {
            const before = text.slice(0, splitAt);
            const after = text.slice(splitAt + 1); // drop the split space

            // Recompute caret relative to split so it stays with what you typed.
            const caretOnNext =
                idx > splitAt ? indent.length + (idx - splitAt) : pos.column;

            const range = new monaco.Range(n, 1, n, model.getLineMaxColumn(n));
            const newText = `${before}\n${indent}${after}`;

            const caret = idx > splitAt
                ? new monaco.Selection(n + 1, caretOnNext, n + 1, caretOnNext)
                : new monaco.Selection(n, pos.column, n, pos.column);

            busy = true;
            try {
                editor.executeEdits('hard-wrap', [{range, text: newText}], [caret]);
            } finally {
                busy = false;
            }
        }
    }

    const d1 = editor.onDidChangeModelContent(onChange);

    return () => {
        d1.dispose();
    };
};