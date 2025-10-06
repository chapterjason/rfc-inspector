import {useEffect, useRef} from 'react';
import type { editor } from 'monaco-editor';

export function useEditorDecorations(instance: editor.IStandaloneCodeEditor | null) {
    const decorationsRef = useRef<editor.IEditorDecorationsCollection | null>(null);

    useEffect(() => {
        if (!instance) {
            return;
        }

        decorationsRef.current = instance.createDecorationsCollection();

        const d1 = instance.onDidDispose(() => {
           decorationsRef.current?.clear();
           decorationsRef.current = null;
        });

        return () => {
            d1.dispose();
            decorationsRef.current?.clear();
            decorationsRef.current = null;
        };
    }, [instance]);

    return decorationsRef;
}