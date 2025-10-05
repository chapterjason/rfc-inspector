import {describe, expect, it} from "vitest";
import {type Token, tokenize, TokenType} from "../../src/index.js";

function collectTokens(input: string): Token[] {
    return Array.from(tokenize(input));
}

describe("Tokenizer", () => {
    it("produces only EOF for empty input", () => {
        // Arrange
        const input = "";

        // Act
        const tokens = collectTokens(input);

        // Assert
        expect(tokens).toEqual([
            {type: TokenType.EOF},
        ]);
    });

    it("captures indentation and data for a single line", () => {
        // Arrange
        const input = "   hello world\n";

        // Act
        const tokens = collectTokens(input);

        // Assert
        expect(tokens).toEqual([
            {
                type: TokenType.DATA_LINE,
                data: "hello world",
                indent: 3,
                offset: 0,
                line: 1,
            },
            {type: TokenType.EOF},
        ]);
    });

    it("emits blank line tokens for empty lines", () => {
        // Arrange
        const input = "line one\n\nline two\n";

        // Act
        const tokens = collectTokens(input);

        // Assert
        expect(tokens).toEqual([
            {
                type: TokenType.DATA_LINE,
                data: "line one",
                indent: 0,
                offset: 0,
                line: 1,
            },
            {
                type: TokenType.BLANK_LINE,
                offset: 9,
                line: 2,
            },
            {
                type: TokenType.DATA_LINE,
                data: "line two",
                indent: 0,
                offset: 10,
                line: 3,
            },
            {type: TokenType.EOF},
        ]);
    });

    it("tracks indentation for empty content lines", () => {
        // Arrange
        const input = "    \n";

        // Act
        const tokens = collectTokens(input);

        // Assert
        expect(tokens).toEqual([
            {
                type: TokenType.DATA_LINE,
                data: "",
                indent: 4,
                offset: 0,
                line: 1,
            },
            {type: TokenType.EOF},
        ]);
    });

    it("produces form feed tokens", () => {
        // Arrange
        const input = "\f\ntext\n";

        // Act
        const tokens = collectTokens(input);

        // Assert
        expect(tokens).toEqual([
            {
                type: TokenType.FORM_FEED_LINE,
                line: 1,
                offset: 0,
            },
            {
                type: TokenType.DATA_LINE,
                data: "text",
                indent: 0,
                offset: 2,
                line: 2,
            },
            {type: TokenType.EOF},
        ]);
    });

    it("increments line numbers for successive data lines", () => {
        // Arrange
        const input = "alpha\nbeta\n";

        // Act
        const tokens = collectTokens(input);

        // Assert
        expect(tokens).toEqual([
            {
                type: TokenType.DATA_LINE,
                data: "alpha",
                indent: 0,
                offset: 0,
                line: 1,
            },
            {
                type: TokenType.DATA_LINE,
                data: "beta",
                indent: 0,
                offset: 6,
                line: 2,
            },
            {type: TokenType.EOF},
        ]);
    });

    it("captures trailing blank lines", () => {
        // Arrange
        const input = "text\n\n";

        // Act
        const tokens = collectTokens(input);

        // Assert
        expect(tokens).toEqual([
            {
                type: TokenType.DATA_LINE,
                data: "text",
                indent: 0,
                offset: 0,
                line: 1,
            },
            {
                type: TokenType.BLANK_LINE,
                offset: 5,
                line: 2,
            },
            {type: TokenType.EOF},
        ]);
    });

    it("supports consecutive blank pages", () => {
        // Arrange
        const input = "\f\n\f\n";

        // Act
        const tokens = collectTokens(input);

        // Assert
        expect(tokens).toEqual([
            {
                type: TokenType.FORM_FEED_LINE,
                line: 1,
                offset: 0,
            },
            {
                type: TokenType.FORM_FEED_LINE,
                line: 2,
                offset: 2,
            },
            {type: TokenType.EOF},
        ]);
    });

    it("emits data lines when the file omits a trailing newline", () => {
        // Arrange
        const input = "gamma";

        // Act
        const tokens = collectTokens(input);

        // Assert
        expect(tokens).toEqual([
            {
                type: TokenType.DATA_LINE,
                data: "gamma",
                indent: 0,
                offset: 0,
                line: 1,
            },
            {type: TokenType.EOF},
        ]);
    });

    it("preserves trailing spaces within the data segment", () => {
        // Arrange
        const input = "value  \n";

        // Act
        const tokens = collectTokens(input);

        // Assert
        expect(tokens).toEqual([
            {
                type: TokenType.DATA_LINE,
                data: "value  ",
                indent: 0,
                offset: 0,
                line: 1,
            },
            {type: TokenType.EOF},
        ]);
    });

    it("treats horizontal tab characters as content", () => {
        // Arrange
        const input = "\tvalue\n";

        // Act
        const tokens = collectTokens(input);

        // Assert
        expect(tokens).toEqual([
            {
                type: TokenType.DATA_LINE,
                data: "\tvalue",
                indent: 0,
                offset: 0,
                line: 1,
            },
            {type: TokenType.EOF},
        ]);
    });

    it("creates blank line tokens for leading newlines", () => {
        // Arrange
        const input = "\n\n\n";

        // Act
        const tokens = collectTokens(input);

        // Assert
        expect(tokens).toEqual([
            {
                type: TokenType.BLANK_LINE,
                line: 1,
                offset: 0,
            },
            {
                type: TokenType.BLANK_LINE,
                line: 2,
                offset: 1,
            },
            {
                type: TokenType.BLANK_LINE,
                line: 3,
                offset: 2,
            },
            {type: TokenType.EOF},
        ]);
    });

    it("handles mixed whitespace, form feeds, and trailing spaces", () => {
        // Arrange
        const input = "\n  alpha\n\f\nbeta  \n";

        // Act
        const tokens = collectTokens(input);

        // Assert
        expect(tokens).toEqual([
            {
                type: TokenType.BLANK_LINE,
                line: 1,
                offset: 0,
            },
            {
                type: TokenType.DATA_LINE,
                data: "alpha",
                indent: 2,
                offset: 1,
                line: 2,
            },
            {
                type: TokenType.FORM_FEED_LINE,
                line: 3,
                offset: 9,
            },
            {
                type: TokenType.DATA_LINE,
                data: "beta  ",
                indent: 0,
                offset: 11,
                line: 4,
            },
            {type: TokenType.EOF},
        ]);
    });

    it("creates form feed tokens without trailing newlines", () => {
        // Arrange
        const input = "\f";

        // Act
        const tokens = collectTokens(input);

        // Assert
        expect(tokens).toEqual([
            {
                type: TokenType.FORM_FEED_LINE,
                line: 1,
                offset: 0,
            },
            {type: TokenType.EOF},
        ]);
    });
});
