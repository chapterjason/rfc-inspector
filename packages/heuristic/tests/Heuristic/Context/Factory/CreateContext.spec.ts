import {ArrayCursor, Parameters} from "@rfc-inspector/common";
import {describe, expect, it} from "vitest";
import {createContext} from "../../../../src/Heuristic/Context/Factory/CreateContext.js";
import {createClassification} from "../../../../src/Heuristic/Factory/CreateClassification.js";
import {createRuleResult} from "../../../../src/Heuristic/Rule/Factory/CreateRuleResult.js";
import {ParagraphRule} from "../../Rule/Markdown/ParagraphRule.js";

describe("createContext", () => {
    it("returns an isolated cursor clone", () => {
        // Arrange: seed a cursor mid-stream to verify index preservation
        const items = ["alpha", "beta", "gamma"];
        const originalCursor = new ArrayCursor(items);
        originalCursor.setIndex(1);

        // Act: build a context from the existing cursor
        const context = createContext(originalCursor);
        const clonedCursor = context.cursor;

        // Assert: cloned cursor mirrors the original state
        expect(clonedCursor.toArray()).toEqual(items);
        expect(clonedCursor.getIndex()).toBe(1);
        expect(context.classifications).toEqual([]);
        expect(context.parameters.getAll()).toEqual({});

        // Act: mutate the original cursor only
        originalCursor.next();

        // Assert: original moves forward, clone remains unchanged
        expect(originalCursor.getIndex()).toBe(2);
        expect(clonedCursor.getIndex()).toBe(1);

        // Act: mutate the cloned cursor only
        clonedCursor.next();

        // Assert: the two cursors now diverge independently
        expect(originalCursor.getIndex()).toBe(2);
        expect(clonedCursor.getIndex()).toBe(2);
    });

    it("honours provided classifications and parameters", () => {
        // Arrange
        const cursor = new ArrayCursor(["alpha", "beta"]);
        const rule = new ParagraphRule();
        const classifications = [
            createClassification(rule, 0, 5, 1, createRuleResult(1, 5)),
        ];
        const parameters = new Parameters<{ flag: boolean }>({flag: true});

        // Act
        const context = createContext(cursor, classifications, parameters);

        // Assert
        expect(context.classifications).toBe(classifications);
        expect(context.parameters).toBe(parameters);
    });
});
