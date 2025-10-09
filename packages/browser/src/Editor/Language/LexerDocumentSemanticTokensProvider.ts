import {CancellationToken, editor, languages} from "monaco-editor";
import {lexemeTypes} from "./LexemeTypes.js";
import {LexemeType} from "@rfc-inspector/lexer";
import {getLexemeType} from "../../Utils/GetLexemeType.js";

import {getLexemes} from "./GetLexemes.js";

export class LexerDocumentSemanticTokensProvider implements languages.DocumentSemanticTokensProvider {
    public getLegend(): languages.SemanticTokensLegend {
        return {
            tokenTypes: lexemeTypes,
            tokenModifiers: [],
        } as languages.SemanticTokensLegend;
    }

    public provideDocumentSemanticTokens(model: editor.ITextModel, _lastResultId: string | null, _token: CancellationToken): languages.ProviderResult<languages.SemanticTokens | languages.SemanticTokensEdits> {
        const lexemes = getLexemes(model);
        const data: number[] = [];

        let lineNumber = 0;
        let previousLine = 0;

        for (const lexeme of lexemes) {
            if (lexeme.type === LexemeType.EOF) {
                break;
            }

            const currentLine = lineNumber;

            const type = lexemeTypes.indexOf(getLexemeType(lexeme));

            if (type === -1) {
                continue;
            }

            if (lexeme.type === LexemeType.BLANK) {
                lineNumber++;
                continue;
            }

            let length = 1;
            let offset = 0;

            if (lexeme.type !== LexemeType.PAGE_BREAK) {
                offset = lexeme.indent;
                length = lexeme.text.length;
            }

            const deltaLine = (data.length === 0) ? currentLine : (currentLine - previousLine);

            data.push(
                deltaLine,
                offset,
                length,
                type,
                0,
            );

            previousLine = currentLine;
            lineNumber++;
        }

        return {
            data: new Uint32Array(data),
        } as languages.SemanticTokens;
    }

    public releaseDocumentSemanticTokens(_resultId: string | undefined): void {
        // noop
    }
}