import {CancellationToken, editor, languages} from "monaco-editor";
import {NodeType, TreeWalker} from "@rfc-inspector/parser";

import {getDocument} from "./GetDocument.js";

const treeWalker = new TreeWalker();

export class ParserLinkProvider implements languages.LinkProvider {
    public provideLinks(model: editor.ITextModel, _token: CancellationToken): languages.ProviderResult<languages.ILinksList> {
        const document = getDocument(model);

        const links: languages.ILink[] = [];

        treeWalker.walk(document, (node) => {
            if (node.type === NodeType.DOCUMENT_REFERENCE && undefined !== node.text.src) {
                const {indent} = node.text;
                const {startLine, endLine, startColumn, endColumn} = node.text.src;

                links.push({
                    url: `https://www.rfc-editor.org/info/rfc${node.id}`,
                    tooltip: `https://www.rfc-editor.org/info/rfc${node.id}`,
                    range: {
                        startLineNumber: startLine,
                        endLineNumber: endLine,
                        endColumn,
                        startColumn: startColumn + indent,
                    },
                } as languages.ILink);
            }
        });

        return {
            links,
            dispose: () => {
                // noop
            },
        }
    }
    resolveLink?: ((link: languages.ILink, token: CancellationToken) => languages.ProviderResult<languages.ILink>) | undefined;
}