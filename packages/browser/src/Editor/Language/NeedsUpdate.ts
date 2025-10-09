import {editor} from "monaco-editor";

export function needsUpdate(model: editor.ITextModel): model is editor.ITextModel & { _rfc: { needsUpdate: true } } {
    if (model._rfc === undefined) {
        model._rfc = {needsUpdate: true};
    }

    if (model._rfc.needsUpdate === undefined) {
        model._rfc.needsUpdate = true;
    }

    return model._rfc.needsUpdate;
}