
export interface BaseToken {
    /**
     * 0-based byte/UTF-16 offset
     */
    offset: number;

    /**
     * 1-based line start
     */
    line: number;
}