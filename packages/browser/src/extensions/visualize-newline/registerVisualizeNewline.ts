import {regexRanges} from "./regexRanges.js";
import {SYMBOL_LF} from "./SYMBOL_LF.js";
import {editor, IDisposable} from "monaco-editor";

export function registerVisualizeNewline(instance: editor.IStandaloneCodeEditor) {
    const collection = instance.createDecorationsCollection();

    const render = () => {
        const model = instance.getModel();

        if (!model) {
            collection.clear();
            return;
        }

        const ranges = regexRanges(/\n/g)(model);
        const decorations = ranges.map(range => ({
            range,
            options: {
                before: {
                    content: SYMBOL_LF,
                    inlineClassName: 'newline-character',
                    cursorStops: editor.InjectedTextCursorStops.None,
                },
                stickiness: editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
            }
        } as editor.IModelDeltaDecoration));

        const ffRanges = regexRanges(/\f/g)(model);

        decorations.push(...ffRanges.map(range => ({
            range,
            options: {
                inlineClassName: 'form-feed-character',
            },
            stickiness: editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        })));

        collection.set(decorations);
    }

    render();

    const d1 = instance.onDidChangeModel(render);
    const d2 = instance.onDidChangeModelContent(render);

    return {
        dispose() {
            d1.dispose();
            d2.dispose();
            collection.clear();
        }
    } as IDisposable;
}