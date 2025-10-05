export enum LexemeType {
    BLANK = 0,
    PAGE_BREAK = 1,
    EOF = 2,

    /**
     * The first content after `LexemeType.BLANK` of the document.
     */
    FRONT_PAGE_HEADER_LINE = 3,
    /**
     * The first content after `LexemeType.FRONT_PAGE_HEADER_LINE` of the document.
     */
    TITLE_LINE = 4,
    /**
     The first data (ignore blank) line directly after a `LexemeType.PAGE_BREAK` line.
     */
    PAGE_HEADER = 5,
    /**
     * The first data (ignore blank) line directly before a `LexemeType.PAGE_BREAK` line.
     */
    PAGE_FOOTER = 6,

    /**
     * Heading is defined as a line without indention and usually directly after a `LexemeType.BLANK`.
     */
    HEADING_LINE = 7,

    /**
     * Inside the section after a `LexemeType.HEADING_LINE` of ~`Table of Contents`
     */
    TOC_LINE = 8,

    /**
     * Anything else
     */
    TEXT_LINE = 9,

    LIST_LINE = 10,
    /**
     * Lines starting with a `>` or `|` character.
     */
    BLOCKQUOTE_LINE = 11,
    /**
     * Higher indention than the text around or as the base indention (> 3 spaces).
     */
    CODE_LINE = 12,

    /**
     * Starts with pattern: '(Figure|Table) \d+', ':', Text
     */
    CAPTION_LINE = 13,
    /**
     * Starts with pattern: 'Note: ', Text
     */
    NOTE_LINE = 14,
    /**
     * Line contains a lot of text with "|" or ">" characters.
     */
    FIGURE_LINE = 15,

    /**
     * Properly identified table lines
     */
    TABLE_LINE = 16,
}