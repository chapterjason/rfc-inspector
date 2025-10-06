import {editor, Range} from "monaco-editor";
import {useEditorDecorations} from "./useEditorDecorations";
import {useEffect} from "react";
import {scrollToLines} from "../Utils/ScrollToLines";

export function useEditorHighlighting(
    instance: editor.IStandaloneCodeEditor | null,
    lines: number[],
) {
    const decorationsCollectionRef = useEditorDecorations(instance);

    useEffect(() => {
        const decorationsCollection = decorationsCollectionRef.current;

        if (!instance || !decorationsCollection) {
            return;
        }

        if (lines.length === 0) {
            decorationsCollection.set([]); // clear if no lines
            return;
        }

        const decorations = lines.map((line) => ({
            range: new Range(line, 1, line, 1),
            options: {
                isWholeLine: true,
                className: 'highlight-selected',
            },
        }));

        decorationsCollection.set(decorations);

        scrollToLines(instance, lines);

        // Cleanup if lines change
        return () => {
            decorationsCollection.set([]);
        };
    }, [instance, lines]);
}