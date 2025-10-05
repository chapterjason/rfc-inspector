import {describe, expect, it} from "vitest";
import {createClassification} from "../../../src/Heuristic/Factory/CreateClassification.js";
import {HeadingRule} from "../Rule/Markdown/HeadingRule.js";

describe("createClassification", () => {
    it("returns a classification snapshot with the provided metadata", () => {
        // Arrange
        const rule = new HeadingRule();
        const ruleResult = {length: 3, score: 17};

        // Act
        const classification = createClassification(rule, 5, 42, 3, ruleResult);

        // Assert
        expect(classification).toEqual({
            index: 5,
            length: 3,
            rule,
            score: 42,
            result: ruleResult,
        });
    });
});
