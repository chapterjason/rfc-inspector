import {describe, expect, it} from 'vitest';
import {Lexer} from '../src/index.js';
import type {Token} from '@rfc-inspector/tokenizer';
import {tokenize} from "@rfc-inspector/tokenizer";
import {LexemeType} from "../src/Lexer/Lexeme/LexemeType.js";

describe('Lexer', () => {
    const metadataLines = [
        '',
        '',
        '',
        '',
        '',
        '',
        'Internet Engineering Task Force (IETF)                     D. Hardt, Ed.',
        'Request for Comments: 6749                                     Microsoft',
        'Obsoletes: 5849                                             October 2012',
        'Category: Standards Track',
        'ISSN: 2070-1721',
        '',
    ];

    const titleLines = [
        '',
        '                 The OAuth 2.0 Authorization Framework',
        '',
    ]

    const sectionTitleLines = [
        'Abstract',
        '',
    ]

    const genericRfcLines = [
        ...metadataLines,
        ...titleLines,
        ...sectionTitleLines,
    ];

    const pageBreakLines = [
        'Denniss & Bradley         Best Current Practice                 [Page 9]',
        '\f',
        'RFC 8252                OAuth 2.0 for Native Apps           October 2017'
    ];

    describe('lex method', () => {
        it('should return empty array for empty token array', () => {
            // Arrange
            const sut = new Lexer();
            const tokens: Token[] = [];

            // Act
            const result = sut.lex(tokens);

            // Assert
            expect(result).toEqual([]);
        });

        it('should classify heading lines', () => {
            // Arrange
            const sut = new Lexer();
            const input = [
                ...genericRfcLines,
                '1. Introduction',
                '',
            ];
            const tokens = Array.from(tokenize(input.join('\n')));

            // Act
            const result = sut.lex(tokens);

            // Assert
            const offset = genericRfcLines.length;
            expect(result.length).toBe(input.length);
            expect(result[offset].type).toBe(LexemeType.HEADING_LINE);
        });

        it('should classify list item lines', () => {
            // Arrange
            const sut = new Lexer();
            const input = [
                ...genericRfcLines,
                '   * This is a list item',
                '     with a second line',
                '',
                '   - This is another list item',
                '',
                '     For example:',
                '',
                '     +---------+---------+---------+',
                '     | Column1 | Column2 | Column3 |',
                '     +---------+---------+---------+',
                '',
                '            Table 1: yeeet',
                '',
                '     This makes it possible.',
                '',
                '   Some text after the list.',
                '',
            ];
            const tokens = Array.from(tokenize(input.join('\n')));

            // Act
            const result = sut.lex(tokens);

            // Assert
            const offset = genericRfcLines.length;
            expect(result.length).toBe(input.length);
            expect(result[offset].type).toBe(LexemeType.LIST_LINE);
            expect(result[offset+1].type).toBe(LexemeType.LIST_LINE);
            expect(result[offset+2].type).toBe(LexemeType.BLANK);
            expect(result[offset+3].type).toBe(LexemeType.LIST_LINE);
            expect(result[offset+4].type).toBe(LexemeType.BLANK);
            expect(result[offset+5].type).toBe(LexemeType.LIST_LINE);
            expect(result[offset+6].type).toBe(LexemeType.BLANK);
            expect(result[offset+7].type).toBe(LexemeType.TABLE_LINE);
            expect(result[offset+8].type).toBe(LexemeType.TABLE_LINE);
            expect(result[offset+9].type).toBe(LexemeType.TABLE_LINE);
            expect(result[offset+10].type).toBe(LexemeType.BLANK);
            expect(result[offset+11].type).toBe(LexemeType.CAPTION_LINE);
            expect(result[offset+12].type).toBe(LexemeType.BLANK);
            expect(result[offset+13].type).toBe(LexemeType.LIST_LINE);
            expect(result[offset+14].type).toBe(LexemeType.BLANK);
            expect(result[offset+15].type).toBe(LexemeType.TEXT_LINE);
        });

        it('should classify note lines', () => {
            // Arrange
            const sut = new Lexer();
            const input = [
                ...genericRfcLines,
                '   Note: this is a line with a note in it',
                '         it can also me multiple lines',
                '',
                '   text after the note',
                '',
            ];
            const tokens = Array.from(tokenize(input.join('\n')));

            // Act
            const result = sut.lex(tokens);

            // Assert
            const offset = genericRfcLines.length;
            expect(result.length).toBe(input.length);
            expect(result[offset].type).toBe(LexemeType.NOTE_LINE);
        });

        it('should classify table lines', () => {
            // Arrange
            const sut = new Lexer();
            const input = [
                ...genericRfcLines,
                '   +---------+---------+---------+',
                '   | Column1 | Column2 | Column3 |',
                '   +---------+---------+---------+',
                '',
                '      Table 1: Example Table with title',
                '           Something is wrong',
                '',
            ];
            const tokens = Array.from(tokenize(input.join('\n')));

            // Act
            const result = sut.lex(tokens);

            // Assert
            const offset = genericRfcLines.length;
            expect(result.length).toBe(input.length);
            expect(result[offset].type).toBe(LexemeType.TABLE_LINE);
            expect(result[offset+1].type).toBe(LexemeType.TABLE_LINE);
            expect(result[offset+2].type).toBe(LexemeType.TABLE_LINE);
            expect(result[offset+3].type).toBe(LexemeType.BLANK);
            expect(result[offset+4].type).toBe(LexemeType.CAPTION_LINE);
            expect(result[offset+5].type).toBe(LexemeType.CAPTION_LINE);
        });

        it('should classify front page header lines', () => {
            // Arrange
            const sut = new Lexer();
            const input = [
                ...genericRfcLines,
            ];
            const tokens = Array.from(tokenize(input.join('\n')));

            // Act
            const result = sut.lex(tokens);

            // Assert
            const offset = genericRfcLines.length;
            expect(result.length).toBe(offset);
            expect(result[8].type).toBe(LexemeType.FRONT_PAGE_HEADER_LINE);
        });

        it('should classify title lines', () => {
            // Arrange
            const sut = new Lexer();
            const input = [
                ...genericRfcLines,
            ];
            const tokens = Array.from(tokenize(input.join('\n')));

            // Act
            const result = sut.lex(tokens);

            // Assert
            const offset = genericRfcLines.length;
            expect(result.length).toBe(offset);
            expect(result[13].type).toBe(LexemeType.TITLE_LINE);
        });

        it('should classify paragraph lines as text', () => {
            // Arrange
            const sut = new Lexer();
            const input = [
                ...genericRfcLines,
                '   This is a paragraph of text that spans',
                '',
            ];
            const tokens = Array.from(tokenize(input.join('\n')));

            // Act
            const result = sut.lex(tokens);

            // Assert
            const offset = genericRfcLines.length;
            expect(result.length).toBe(input.length);
            expect(result[offset].type).toBe(LexemeType.TEXT_LINE);
        });

        it('should classify blank lines', () => {
            // Arrange
            const sut = new Lexer();
            const input = [
                ...genericRfcLines,
                '',
                '',
            ];
            const tokens = Array.from(tokenize(input.join('\n')));

            // Act
            const result = sut.lex(tokens);

            // Assert
            const offset = genericRfcLines.length;
            expect(result.length).toBe(offset + 2);
            expect(result[offset].type).toBe(LexemeType.BLANK);
        });

        it('should classify page break lines', () => {
            // Arrange
            const sut = new Lexer();
            const input = [
                ...genericRfcLines,
                '\f',
            ];
            const tokens = Array.from(tokenize(input.join('\n')));

            // Act
            const result = sut.lex(tokens);

            // Assert
            const offset = genericRfcLines.length;
            expect(result.length).toBe(offset + 2);
            expect(result[offset].type).toBe(LexemeType.PAGE_BREAK);
        });

        it('should not create blank line after page break', () => {
            // Arrange
            const sut = new Lexer();

            // Real-world scenario: page footer + page break + page header
            const input = [
                ...genericRfcLines,
                'Hardt                        Standards Track                    [Page 4]',
                '\f',
                'RFC 6749                        OAuth 2.0                   October 2012',
            ];
            const tokens = Array.from(tokenize(input.join('\n')));

            // Act
            const result = sut.lex(tokens);

            // Assert
            const offset = genericRfcLines.length;
            const relevantLines = result.slice(offset);
            expect(relevantLines.length).toBe(4); // footer, pagebreak, header, EOF - no blank line
            expect(relevantLines[0].type).toBe(LexemeType.PAGE_FOOTER);
            expect(relevantLines[1].type).toBe(LexemeType.PAGE_BREAK);
            expect(relevantLines[2].type).toBe(LexemeType.PAGE_HEADER);

            // Ensure no blank line was created
            const hasBlankLine = relevantLines.some(line => line.type === LexemeType.BLANK);
            expect(hasBlankLine).toBe(false);
        });

        it('should handle mixed content correctly', () => {
            // Arrange
            const sut = new Lexer();
            const input = [
                ...genericRfcLines,
                '1. Introduction',
                '',
                '   This is an introduction paragraph.',
                '',
                '    GET /api HTTP/1.1',
                '    Host: example.com',
                '',
                '    HTTP/1.1 200 OK',
                '    Content-Type: text/plain',
                '',
                '     rulename = ALPHA',
                '',
            ];
            const tokens = Array.from(tokenize(input.join('\n')));

            // Act
            const result = sut.lex(tokens);

            // Assert
            const offset = genericRfcLines.length;
            const relevantLines = result.slice(offset);

            expect(relevantLines.length).toBe(12);

            // Check specific line types
            expect(relevantLines[0].type).toBe(LexemeType.HEADING_LINE); // "1. Introduction"
            expect(relevantLines[1].type).toBe(LexemeType.BLANK);        // blank line
            expect(relevantLines[2].type).toBe(LexemeType.TEXT_LINE);         // paragraph
            expect(relevantLines[3].type).toBe(LexemeType.BLANK);        // blank line
            expect(relevantLines[4].type).toBe(LexemeType.TEXT_LINE);  // GET request
            expect(relevantLines[5].type).toBe(LexemeType.TEXT_LINE);   // Host header
            expect(relevantLines[6].type).toBe(LexemeType.BLANK);        // blank line
            expect(relevantLines[7].type).toBe(LexemeType.TEXT_LINE); // HTTP response
            expect(relevantLines[8].type).toBe(LexemeType.TEXT_LINE);   // Content-Type
            expect(relevantLines[9].type).toBe(LexemeType.BLANK);        // blank line
            expect(relevantLines[10].type).toBe(LexemeType.TEXT_LINE);        // ABNF rule
        });

        it('should maintain line numbers correctly', () => {
            // Arrange
            const sut = new Lexer();
            const input = [
                ...genericRfcLines,
                'Line 1',
                'Line 2',
                'Line 3',
                '',
            ];
            const tokens = Array.from(tokenize(input.join('\n')));

            // Act
            const result = sut.lex(tokens);

            // Assert
            expect(result.length).toBe(input.length);
        });
    });

    describe('Advanced Classification', () => {
        it('should classify table of contents lines', () => {
            // Arrange
            const sut = new Lexer();
            const input = [
                ...genericRfcLines,
                '   some content here',
                '',
                'Table of Contents',
                '',
                '   1. Introduction ................................. 2',
                '   2. Something else ............................... 3',
                '',
                ...pageBreakLines,
                '',
                '   3. More here .................................... 4',
                '',
                'Next heading',
                '',
            ];

            const tokens = Array.from(tokenize(input.join('\n')));

            // Act
            const result = sut.lex(tokens);

            // Assert
            const offset = genericRfcLines.length;
            const relevantLines = result.slice(offset);
            expect(result.length).toBe(input.length);
            expect(relevantLines[0].type).toBe(LexemeType.TEXT_LINE);
            expect(relevantLines[1].type).toBe(LexemeType.BLANK);
            expect(relevantLines[2].type).toBe(LexemeType.HEADING_LINE);
            expect(relevantLines[3].type).toBe(LexemeType.BLANK);
            expect(relevantLines[4].type).toBe(LexemeType.TOC_LINE);
            expect(relevantLines[5].type).toBe(LexemeType.TOC_LINE);
            expect(relevantLines[6].type).toBe(LexemeType.BLANK);
            expect(relevantLines[7].type).toBe(LexemeType.PAGE_FOOTER);
            expect(relevantLines[8].type).toBe(LexemeType.PAGE_BREAK);
            expect(relevantLines[9].type).toBe(LexemeType.PAGE_HEADER);
            expect(relevantLines[10].type).toBe(LexemeType.BLANK);
            expect(relevantLines[11].type).toBe(LexemeType.TOC_LINE);
            expect(relevantLines[12].type).toBe(LexemeType.BLANK);
            expect(relevantLines[13].type).toBe(LexemeType.HEADING_LINE);
            expect(relevantLines[14].type).toBe(LexemeType.EOF);
        });

        it('should classify caption and figure lines', () => {
            // Arrange
            const sut = new Lexer();
            const input = [
                ...genericRfcLines,
                '     +----------+',
                '     | Resource |',
                '     |  Owner   |',
                '     |          |',
                '     +----------+',
                '          ^',
                '          |',
                '         (B)',
                '     +----|-----+          Client Identifier     +---------------+',
                '     |         -+----(A)-- & Redirection URI --->|               |',
                '     |  User-   |                                | Authorization |',
                '     |  Agent  -|----(B)-- User authenticates -->|     Server    |',
                '     |          |                                |               |',
                '     |          |<---(C)--- Redirection URI ----<|               |',
                '     |          |          with Access Token     +---------------+',
                '     |          |            in Fragment',
                '     |          |                                +---------------+',
                '     |          |----(D)--- Redirection URI ---->|   Web-Hosted  |',
                '     |          |          without Fragment      |     Client    |',
                '     |          |                                |    Resource   |',
                '     |     (F)  |<---(E)------- Script ---------<|               |',
                '     |          |                                +---------------+',
                '     +-|--------+',
                '       |    |',
                '      (A)  (G) Access Token',
                '       |    |',
                '       ^    v',
                '     +---------+',
                '     |         |',
                '     |  Client |',
                '     |         |',
                '     +---------+',
                '',
                // Let's also handle Note lines
                '   Note: The lines illustrating steps (A) and (B) are broken into two',
                '   parts as they pass through the user-agent.',
                '',
                // Doesn't correlate to the graph above, but we needed an example with >1 lines
                '           Figure 25: Example of OpenID Connect Request Utilizing',
                '                          "authorization_details"',
                '',
            ];
            const tokens = Array.from(tokenize(input.join('\n')));

            // Act
            const result = sut.lex(tokens);

            // Assert
            const relevantLines = result.slice(genericRfcLines.length);
            expect(result.length).toBe(input.length);

            expect(relevantLines[0].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[1].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[2].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[3].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[4].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[5].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[6].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[7].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[8].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[9].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[10].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[11].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[12].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[13].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[14].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[15].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[15].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[16].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[17].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[18].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[19].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[20].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[21].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[22].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[23].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[24].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[25].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[26].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[27].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[28].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[29].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[30].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[31].type).toBe(LexemeType.FIGURE_LINE);
            expect(relevantLines[32].type).toBe(LexemeType.BLANK);
            expect(relevantLines[33].type).toBe(LexemeType.NOTE_LINE);
            expect(relevantLines[34].type).toBe(LexemeType.NOTE_LINE);
            expect(relevantLines[35].type).toBe(LexemeType.BLANK);
            expect(relevantLines[36].type).toBe(LexemeType.CAPTION_LINE);
            expect(relevantLines[38].type).toBe(LexemeType.EOF);
        });

        it('should classify page header lines', () => {
            // Arrange
            const sut = new Lexer();
            const input = [
                ...genericRfcLines,
                ...pageBreakLines,
                '',
            ];
            const tokens = Array.from(tokenize(input.join('\n')));

            // Act
            const result = sut.lex(tokens);

            // Assert
            const offset = genericRfcLines.length;
            expect(result.length).toBe(input.length);
            expect(result[offset].type).toBe(LexemeType.PAGE_FOOTER);
            expect(result[offset+1].type).toBe(LexemeType.PAGE_BREAK);
            expect(result[offset + 2].type).toBe(LexemeType.PAGE_HEADER);
        });
    });

    describe('Priority Handling', () => {
        it('should prioritize document structure over content', () => {
            // Arrange
            const sut = new Lexer();
            const input = [
                ...genericRfcLines,
                '2.1. Terminology', // Should be heading title, not text
                '',
            ];
            const tokens = Array.from(tokenize(input.join('\n')));

            // Act
            const result = sut.lex(tokens);

            // Assert
            const offset = genericRfcLines.length;
            expect(result.length).toBe(input.length);
            expect(result[offset].type).toBe(LexemeType.HEADING_LINE);
        });
    });
});