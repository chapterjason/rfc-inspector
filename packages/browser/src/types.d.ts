import 'monaco-editor';

declare module 'monaco-editor' {
    import type {Token} from "@rfc-inspector/tokenizer";
    import type {Lexeme} from "@rfc-inspector/lexer";
    import type {DocumentNode} from "@rfc-inspector/parser";

    namespace editor {
        export interface ITextModel {
            _rfc?: {
                needsUpdate?: boolean;
                tokens?: Token[];
                lexemes?: Lexeme[];
                document?: DocumentNode;
            };
        }
    }
}