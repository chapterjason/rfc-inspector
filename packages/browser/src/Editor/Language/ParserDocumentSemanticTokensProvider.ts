import {CancellationToken, editor, languages} from "monaco-editor";
import {nodeTypes} from "./NodeTypes.js";
import {NodeEncoder} from "../Encoder/NodeEncoder.js";
import {getDocument} from "./GetDocument.js";

const nodeEncoder = new NodeEncoder(nodeTypes);

export class ParserDocumentSemanticTokensProvider implements languages.DocumentSemanticTokensProvider {
    public getLegend(): languages.SemanticTokensLegend {
        return {
            tokenTypes: nodeTypes,
            tokenModifiers: [],
        } as languages.SemanticTokensLegend;
    }

    public provideDocumentSemanticTokens(model: editor.ITextModel, _lastResultId: string | null, _token: CancellationToken): languages.ProviderResult<languages.SemanticTokens | languages.SemanticTokensEdits> {
        const document = getDocument(model);

        const data = nodeEncoder.encode(document).flat();

        return {
            data: new Uint32Array(data),
        } as languages.SemanticTokens;
    }

    public releaseDocumentSemanticTokens(_resultId: string | undefined): void {
        // noop
    }

}