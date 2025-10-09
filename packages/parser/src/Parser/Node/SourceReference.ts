export interface SourceReference {
    startLine: number;
    endLine: number;
    startColumn: number;

    /**
     * The column after the last character of the content (exclusive).
     *
     * @example "Hello" -> startColumn: 1, endColumn: 6
     */
    endColumn: number;
}