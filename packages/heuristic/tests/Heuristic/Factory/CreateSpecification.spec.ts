import {describe, expect, it} from "vitest";
import {HeadingRule} from "../Rule/Markdown/HeadingRule.js";
import {ParagraphRule} from "../Rule/Markdown/ParagraphRule.js";
import {createRuleSpecification, createSpecification, type RuleSpecification} from "../../../src/index.js";

describe("createSpecification", () => {
    it("wraps the provided rules array without copying", () => {
        // Arrange
        const rules: RuleSpecification<string>[] = [
            createRuleSpecification(new HeadingRule(), 80),
            createRuleSpecification(new ParagraphRule(), 10),
        ];

        // Act
        const specification = createSpecification(rules);

        // Assert
        expect(specification.rules).toBe(rules);
        expect(specification.rules).toHaveLength(2);
    });

    it("handles an empty rule list", () => {
        // Arrange
        const rules: RuleSpecification<string>[] = [];

        // Act
        const specification = createSpecification(rules);

        // Assert
        expect(specification.rules).toEqual([]);
    });
});
