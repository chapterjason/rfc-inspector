import {editor, IDisposable, Range, Selection} from "monaco-editor";

/**
 * @todo needs human code style rework and review
 *       works, but utility functions can be placed elsewhere
 */

const isWS = (ch: string) => /\s/.test(ch);

function lastBreakPos(s: string, col: number, indentLen: number) {
    const j = Math.min(col, s.length - 1);
    for (let i = j; i >= indentLen; i--) if (isWS(s[i])) return i;
    return -1;
}
function firstBreakPosAfter(s: string, from: number) {
    for (let i = Math.max(0, from); i < s.length; i++) if (isWS(s[i])) return i;
    return -1;
}

export function registerHardWrap(editor: editor.IStandaloneCodeEditor, HARD_WRAP_COL = 72) {
    let busy = false;

    function onChange() {
        if (busy) return;

        const model = editor.getModel();
        const pos = editor.getPosition();
        if (!model || !pos) return;

        const n = pos.lineNumber;
        const text = model.getLineContent(n);
        if (text.length <= HARD_WRAP_COL) return;

        const indent = (text.match(/^\s*/)?.[0]) ?? '';
        const indentLen = indent.length;

        // 1) Prefer wrapping at last whitespace ≤ limit (never inside indent).
        let splitAt = lastBreakPos(text, HARD_WRAP_COL, indentLen);

        // 2) Fallback: if none, but the first breakable space exists after the limit,
        // and the segment from indent to that space is a single word, split there.
        if (splitAt < 0) {
            const after = firstBreakPosAfter(text, HARD_WRAP_COL + 1);
            if (after > 0) {
                const segment = text.slice(indentLen, after); // content before that space
                if (!/\s/.test(segment)) splitAt = after;     // single long word → split after it
            }
        }

        if (splitAt <= 0) return; // still nothing safe to do

        const before = text.slice(0, splitAt).replace(/\s+$/, '');
        const after  = text.slice(splitAt + 1); // drop the split whitespace
        if (!after.length) return;

        const caretIdx0 = Math.max(0, Math.min(text.length, pos.column - 1));

        const range  = new Range(n, 1, n, model.getLineMaxColumn(n));
        const newTxt = `${before}\n${indent}${after}`;

        const caret =
            caretIdx0 > splitAt
                ? new Selection(n + 1, indentLen + (caretIdx0 - splitAt) + 1, n + 1, indentLen + (caretIdx0 - splitAt) + 1)
                : new Selection(n, pos.column, n, pos.column);

        busy = true;
        try {
            editor.executeEdits('hard-wrap', [{ range, text: newTxt }], [caret]);
        } finally {
            busy = false;
        }
    }

    const d1 = editor.onDidChangeModelContent(onChange);

    return {
        dispose() {
            d1.dispose();
        }
    } as IDisposable;
}
