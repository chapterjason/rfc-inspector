import {ArrayCursor, Parameters} from "@rfc-inspector/common";
import {describe, expect, it} from "vitest";
import {Context} from "../../../src/Heuristic/Context/Context.js";
import {createClassification} from "../../../src/Heuristic/Factory/CreateClassification.js";
import {createRuleResult} from "../../../src/Heuristic/Rule/Factory/CreateRuleResult.js";
import {HeadingRule} from "../Rule/Markdown/HeadingRule.js";
import {ParagraphRule} from "../Rule/Markdown/ParagraphRule.js";

describe("Context", () => {
    const items = ["alpha", "beta", "gamma", "delta", "epsilon"];

    it("counts remaining items until a predicate matches", () => {
        // Arrange: position the cursor near the start
        const cursor = new ArrayCursor([...items]);
        cursor.setIndex(1);
        const context = new Context(cursor, [], new Parameters());

        // Act & Assert: count until a match and until the end of the cursor
        expect(context.countUntil(item => item === "delta")).toBe(2);
        expect(context.countUntil(item => item === "missing" as string)).toBe(4);
    });

    it("exposes helpers to inspect existing classifications", () => {
        // Arrange: construct sample classifications spanning different ranges
        const ruleA = new HeadingRule();
        const ruleB = new ParagraphRule();

        const classificationOne = createClassification(ruleA, 0, 10, 1, createRuleResult(1, 10));
        const classificationTwo = createClassification(ruleB, 1, 20, 2, createRuleResult(2, 20));
        const classificationThree = createClassification(ruleA, 4, 5, 1, createRuleResult(1, 5));

        const cursor = new ArrayCursor([...items]);
        const context = new Context(cursor, [classificationOne, classificationTwo, classificationThree], new Parameters());

        // Assert: latest classification is the one appended last
        expect(context.getLatestClassification()).toBe(classificationThree);

        // Assert: locate by absolute index as long as it falls within the span
        expect(context.findClassificationAtIndex(2)).toBe(classificationTwo);
        expect(context.findClassificationAtIndex(4)).toBe(classificationThree);
        expect(context.findClassificationAtIndex(1)).toBe(classificationTwo);
        expect(context.findClassificationAtIndex(10)).toBeNull();
    });

    it("reuses forward lookup state for monotonic classification queries", () => {
        // Arrange: classifications cover contiguous pairs of items in order
        const rule = new HeadingRule();
        const classifications = Array.from({length: 6}, (_, index) => {
            return createClassification(rule, index * 2, 5, 2, createRuleResult(2, 5));
        });

        const cursor = new ArrayCursor([...items, ...items]);
        const context = new Context(cursor, classifications, new Parameters());

        // Act & Assert: advancing lookups should always yield the classification covering the queried index
        expect(context.findClassificationAtIndex(0)).toBe(classifications[0]);
        expect(context.findClassificationAtIndex(1)).toBe(classifications[0]);
        expect(context.findClassificationAtIndex(2)).toBe(classifications[1]);
        expect(context.findClassificationAtIndex(3)).toBe(classifications[1]);
        expect(context.findClassificationAtIndex(9)).toBe(classifications[4]);
        expect(context.findClassificationAtIndex(11)).toBe(classifications[5]);
        expect(context.findClassificationAtIndex(999)).toBeNull();
    });

    it("searches upcoming items within a bounded lookahead", () => {
        // Arrange: cursor near the start for forward searches
        const cursor = new ArrayCursor([...items]);
        cursor.setIndex(1);
        const context = new Context(cursor, [], new Parameters());

        // Act & Assert: locate the first upcoming match
        expect(context.getNextMatchingItem(3, (item) => item?.endsWith("a") ?? false)).toEqual({
            index: 2,
            item: "gamma",
        });
        expect(context.getNextMatchingItem(1, (item) => item === "gamma")).toEqual({
            index: 2,
            item: "gamma",
        });
    });
});
