import {describe, expect, it} from "vitest";
import {render, TokenType, type Token, tokenize} from "../../../src/index.js";

describe("Render", () => {
    it("reconstructs data and blank lines", () => {
        // Arrange
        const source = "alpha\n\n  beta\n";
        const tokens = Array.from(tokenize(source));

        // Act
        const result = render(tokens);

        // Assert
        expect(result).toBe(source);
    });

    it("reconstructs complex tokenizer output", () => {
        // Arrange
        const source = "\n  alpha\n\f\nbeta  \n";
        const tokens = Array.from(tokenize(source));

        // Act
        const result = render(tokens);

        // Assert
        expect(result).toBe(source);
    });

    it("emits a newline per form feed line", () => {
        // Arrange
        const tokens: Token[] = [
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
        ];

        // Act
        const result = render(tokens);

        // Assert
        expect(result).toBe("\f\n\f\n");
    });

    it("adds a newline suffix for data lines", () => {
        // Arrange
        const tokens: Token[] = [
            {
                type: TokenType.DATA_LINE,
                data: "gamma",
                indent: 0,
                offset: 0,
                line: 1,
            },
            {type: TokenType.EOF},
        ];

        // Act
        const result = render(tokens);

        // Assert
        expect(result).toBe("gamma\n");
    });

    it("renders blank lines without double spacing", () => {
        // Arrange
        const tokens: Token[] = [
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
            {type: TokenType.EOF},
        ];

        // Act
        const result = render(tokens);

        // Assert
        expect(result).toBe("\n\n");
    });

    it("throws when EOF is not the final token", () => {
        // Arrange
        const tokens: Token[] = [
            {type: TokenType.EOF},
            {
                type: TokenType.DATA_LINE,
                data: "late",
                indent: 0,
                offset: 0,
                line: 1,
            },
        ];

        // Act & Assert
        expect(() => render(tokens)).toThrow(/EOF token must be the final token/);
    });

    it("throws when EOF is not the final token", () => {
        // Arrange
        const tokens: Token[] = [
            {type: TokenType.EOF},
            {
                type: TokenType.DATA_LINE,
                data: "late",
                indent: 0,
                offset: 0,
                line: 1,
            },
        ];

        // Act & Assert
        expect(() => render(tokens)).toThrow(/EOF token must be the final token/);
    });

    it("throws for unknown token types", () => {
        // Arrange
        const tokens: Token[] = [
            {
                type: 1000 as TokenType,
            } as Token,
        ];

        // Act & Assert
        expect(() => render(tokens)).toThrow(/Unknown token type/);
    });

    it("ignores trailing EOF tokens", () => {
        // Arrange
        const tokens: Token[] = [{type: TokenType.EOF}];

        // Act
        const result = render(tokens);

        // Assert
        expect(result).toBe("");
    });
});
