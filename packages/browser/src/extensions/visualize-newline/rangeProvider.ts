import * as monaco from "monaco-editor";

export type RangeProvider = (model: monaco.editor.ITextModel) => monaco.IRange[];