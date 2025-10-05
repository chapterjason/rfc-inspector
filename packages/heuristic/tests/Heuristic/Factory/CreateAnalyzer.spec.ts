import {ArrayCursor} from "@rfc-inspector/common";
import {describe, expect, it} from "vitest";
import {HeadingRule} from "../Rule/Markdown/HeadingRule.js";
import {ParagraphRule} from "../Rule/Markdown/ParagraphRule.js";
import {ListItemRule} from "../Rule/Markdown/ListItemRule.js";
import {
    Analyzer,
    type Classification,
    createAnalyzer,
    createRuleSpecification,
    type OverlapResolver,
    type RuleSpecification,
    type ScoringFunction,
    type Specification
} from "../../../src/index.js";

describe("createAnalyzer", () => {
    it("builds an analyzer with default scoring and overlap handling", () => {
        // Arrange: specification with two competing rules
        const headingRule = new HeadingRule();
        const paragraphRule = new ParagraphRule();

        const headingSpecification = createRuleSpecification(headingRule, 120);
        const paragraphSpecification = createRuleSpecification(paragraphRule, 20);

        const specification: Specification<string> = {
            rules: [headingSpecification, paragraphSpecification],
        };

        // Act
        const analyzer = createAnalyzer(specification);
        const classifications = analyzer.analyzeCursor(new ArrayCursor(["# Title"]));

        // Assert: analyzer uses default scoring (priority and match score)
        expect(analyzer).toBeInstanceOf(Analyzer);
        expect(classifications).toHaveLength(1);
        expect(classifications[0]?.rule).toBe(headingRule);
        expect(classifications[0]?.score).toBeGreaterThan(headingSpecification.priority);
    });

    it("honors custom scoring and overlap implementations", () => {
        // Arrange: rules that both match so we can observe callbacks
        const listRule = new ListItemRule();
        const paragraphRule = new ParagraphRule();

        const listSpecification = createRuleSpecification(listRule, 40);
        const paragraphSpecification = createRuleSpecification(paragraphRule, 5);

        const specification: Specification<string> = {
            rules: [listSpecification, paragraphSpecification],
        };

        const scoringCalls: [RuleSpecification<string>, number][] = [];
        const scoringFunction: ScoringFunction<string> = (ruleSpecification, matchScore) => {
            scoringCalls.push([ruleSpecification, matchScore]);
            return 1;
        };
        const overlapCalls: [Classification<string> | null, Classification<string>][] = [];
        const overlapResolver: OverlapResolver<string> = (current, incoming) => {
            overlapCalls.push([current, incoming]);
            return incoming;
        };

        const analyzer = createAnalyzer(specification, {scoringFunction, overlapResolver});

        // Act
        const classifications = analyzer.analyzeCursor(new ArrayCursor(["- item"]));

        // Assert: injected functions were used during analysis
        expect(scoringCalls).toHaveLength(2);
        expect(overlapCalls).toHaveLength(1);
        expect(classifications[0]?.rule).toBe(paragraphRule);
        expect(paragraphRule.acceptInvocations).toBe(1);
    });
});
