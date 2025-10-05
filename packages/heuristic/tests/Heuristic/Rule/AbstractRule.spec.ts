import {ArrayCursor, Parameters} from "@rfc-inspector/common";
import {describe, expect, it} from "vitest";
import {ParagraphRule} from "./Markdown/ParagraphRule.js";
import {CodeFenceRule} from "./Markdown/CodeFenceRule.js";
import {type Classification, createContext} from "../../../src/index.js";

describe("AbstractRule", () => {

    it("stores constructor arguments on the instance", () => {
        // Arrange & Act
        const rule = new ParagraphRule();
        const stopRule = new CodeFenceRule();

        // Assert
        expect(rule.name).toBe("markdown-paragraph");
        expect(rule.type).toBe("PARAGRAPH");
        expect(rule.stopWhenMatched).toBe(false);

        expect(stopRule.stopWhenMatched).toBe(true);
    });

    it("provides a no-op onAccept implementation for subclasses", () => {
        // Arrange
        const rule = new ParagraphRule();
        const parameters = new Parameters();
        const cursor = new ArrayCursor(["alpha", "beta"]);
        const classification: Classification<string> = {
            rule,
            index: 0,
            length: 1,
            score: 1,
            result: {length: 1, score: 1},
        }
        const context = createContext<string>(cursor, [], parameters);

        // Act & Assert: invoking the default handler should not throw
        expect(() => rule.onAccept(context, classification)).not.toThrow();
    });
});
