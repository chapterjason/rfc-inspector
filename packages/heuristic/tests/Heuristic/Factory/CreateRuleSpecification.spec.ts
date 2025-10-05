import {describe, expect, it} from "vitest";
import {createRuleSpecification} from "../../../src/index.js";
import {HeadingRule} from "../Rule/Markdown/HeadingRule.js";

describe("createRuleSpecification", () => {
    it("wraps the rule with the provided priority", () => {
        // Arrange
        const rule = new HeadingRule();

        // Act
        const specification = createRuleSpecification(rule, 75);

        // Assert
        expect(specification).toEqual({
            priority: 75,
            rule,
        });
    });

    it("defaults priority to zero when omitted", () => {
        // Arrange
        const rule = new HeadingRule();

        // Act
        const specification = createRuleSpecification(rule);

        // Assert
        expect(specification).toEqual({
            priority: 0,
            rule,
        });
    });
});
