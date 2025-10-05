import {describe, expect, it} from "vitest";
import {createRuleResult} from "../../../../src/Heuristic/Rule/Factory/CreateRuleResult.js";

describe("createRuleResult", () => {
    it("uses default length and score when omitted", () => {
        // Act
        const result = createRuleResult();

        // Assert
        expect(result).toEqual({length: 1, score: 100});
    });

    it("allows overriding length and score", () => {
        // Act
        const result = createRuleResult(4, 250);

        // Assert
        expect(result).toEqual({length: 4, score: 250});
    });
});
