import {describe, expect, it} from "vitest";
import {ArrayCursor} from "@rfc-inspector/common";
import {Analyzer} from "../../src/Heuristic/Analyzer.js";
import type {Specification} from "../../src/Heuristic/Specification.js";
import type {ScoringFunction} from "../../src/Heuristic/ScoringFunction.js";
import type {OverlapResolver} from "../../src/Heuristic/OverlapResolver.js";
import type {Context} from "../../src/Heuristic/Context/Context.js";
import {HeadingRule} from "./Rule/Markdown/HeadingRule.js";
import {ParagraphRule} from "./Rule/Markdown/ParagraphRule.js";
import {ListItemRule} from "./Rule/Markdown/ListItemRule.js";
import {CodeFenceRule} from "./Rule/Markdown/CodeFenceRule.js";
import type {Classification} from "../../src/Heuristic/Classification.js";
import type {RuleSpecification} from "../../src/Heuristic/RuleSpecification.js";
import {createRuleSpecification} from "../../src/Heuristic/Factory/CreateRuleSpecification.js";
import {BlockQuoteRule} from "./Rule/Markdown/BlockQuoteRule.js";

describe("Analyzer", () => {
    it("selects the highest scoring classification via custom scoring and overlap handling", () => {
        // Arrange: allow multiple rules to match a heading line
        const lines = ["# Document Title"];
        const cursor = new ArrayCursor(lines);

        const headingRule = new HeadingRule();
        const paragraphRule = new ParagraphRule();

        const headingSpecification = createRuleSpecification(headingRule, 100);
        const paragraphSpecification = createRuleSpecification(paragraphRule, 30);

        const specification: Specification<string> = {
            rules: [headingSpecification, paragraphSpecification],
        };

        const scoringCalls: [RuleSpecification<string>, number][] = [];
        const scoringFunction: ScoringFunction<string> = (ruleSpecification, matchScore) => {
            scoringCalls.push([ruleSpecification, matchScore]);
            return ruleSpecification.priority + matchScore;
        };

        const overlapCalls: [Classification<string> | null, Classification<string>][] = [];
        const overlapResolver: OverlapResolver<string> = (current, incoming) => {
            overlapCalls.push([current, incoming]);
            if (!current) {
                return incoming;
            }
            return incoming.score >= current.score ? incoming : current;
        };

        const analyzer = new Analyzer(specification, {scoringFunction, overlapResolver});

        // Act
        const classifications = analyzer.analyzeCursor(cursor);

        // Assert: heading rule should outscore the paragraph fallback
        expect(classifications).toHaveLength(1);
        expect(classifications[0]?.rule).toBe(headingRule);
        expect(classifications[0]?.score).toBeGreaterThan(headingSpecification.priority);
        expect(headingRule.acceptInvocations).toBe(1);
        expect(paragraphRule.acceptInvocations).toBe(0);
        expect(paragraphRule.matchInvocations).toBeGreaterThanOrEqual(1);

        expect(scoringCalls).toHaveLength(2);
        expect(overlapCalls).toHaveLength(1);
    });

    it("throws when no rule matches the current cursor position", () => {
        // Arrange: list rule fails to match a plain paragraph line
        const cursor = new ArrayCursor(["Plain paragraph line."]);

        const listRule = new ListItemRule();
        const specification: Specification<string> = {
            rules: [
                createRuleSpecification(listRule, 50),
            ],
        };

        const analyzer = new Analyzer(specification, {
            scoringFunction: () => 0,
            overlapResolver: (_current, incoming) => incoming,
        });

        // Act & Assert: analysis fails immediately because nothing matches
        expect(() => analyzer.analyzeCursor(cursor)).toThrowError("No rule matched at index 0");
        expect(listRule.matchInvocations).toBe(1);
    });

    it("stops evaluating further rules once a stopWhenMatched rule matches", () => {
        // Arrange: code fence rule captures the block and aborts further checks
        const cursor = new ArrayCursor([
            "```ts",
            "const value = 1;",
            "```",
        ]);

        const codeFenceRule = new CodeFenceRule();
        const paragraphRule = new ParagraphRule();

        const specification: Specification<string> = {
            rules: [
                createRuleSpecification(codeFenceRule, 90),
                createRuleSpecification(paragraphRule, 10),
            ],
        };

        const analyzer = new Analyzer(specification, {
            scoringFunction: (ruleSpecification, matchScore) => {
                return ruleSpecification.priority + matchScore;
            },
            overlapResolver: (_current, incoming) => incoming,
        });

        // Act
        const classifications = analyzer.analyzeCursor(cursor);

        // Assert: only the fence rule runs, paragraph fallback never triggers
        expect(classifications).toHaveLength(1);
        expect(classifications[0]?.rule).toBe(codeFenceRule);
        expect(classifications[0]?.length).toBe(3);
        expect(codeFenceRule.acceptInvocations).toBe(1);
        expect(paragraphRule.matchInvocations).toBe(0);
    });

    it("skips lines covered by stopWhenMatched rule and does not evaluate other rules within that range", () => {
        // Arrange: a stopWhenMatched rule covering multiple lines should prevent other rules from being evaluated within its range
        const cursor = new ArrayCursor([
            "```ts",
            "const value = 1;",
            "```",
            "after",
        ]);

        const codeFenceRule = new CodeFenceRule();
        const headingRule = new HeadingRule();
        const paragraphRule = new ParagraphRule();

        const specification: Specification<string> = {
            rules: [
                createRuleSpecification(codeFenceRule, 90),
                createRuleSpecification(headingRule, 50),
                createRuleSpecification(paragraphRule, 10),
            ],
        };

        const analyzer = new Analyzer(specification, {
            scoringFunction: (ruleSpecification, matchScore) => {
                return ruleSpecification.priority + matchScore;
            },
            overlapResolver: (_current, incoming) => incoming,
        });

        // Act
        const classifications = analyzer.analyzeCursor(cursor);

        // Assert: only fence at index 0 and paragraph at index 3
        expect(classifications).toHaveLength(2);
        expect(classifications[0]?.rule).toBe(codeFenceRule);
        expect(classifications[0]?.index).toBe(0);
        expect(classifications[0]?.length).toBe(3);
        expect(classifications[1]?.rule).toBe(paragraphRule);
        expect(classifications[1]?.index).toBe(3);
        
        // HeadingRule should never be evaluated at indices 1 or 2 (inside the fence)
        expect(headingRule.matchInvocations).toBe(1); // Only at index 0 and 3
        expect(codeFenceRule.matchInvocations).toBe(2); // Only at index 0
    });

    it("calls onAccept for each separate occurrence of the same rule type", () => {
        // Arrange: two block quotes separated by a blank line
        const cursor = new ArrayCursor([
            "> First block quote",
            "- test",
            "> Second block quote",
        ]);

        const blockQuoteRule = new BlockQuoteRule();
        const listItemRule = new ListItemRule();

        const specification: Specification<string> = {
            rules: [
                createRuleSpecification(blockQuoteRule, 90),
                createRuleSpecification(listItemRule, 10),
            ],
        };

        const analyzer = new Analyzer(specification, {
            scoringFunction: (ruleSpecification, matchScore) => {
                return ruleSpecification.priority + matchScore;
            },
            overlapResolver: (_current, incoming) => incoming,
        });

        // Act
        const classifications = analyzer.analyzeCursor(cursor);

        // Assert: two separate block quote classifications and one blank line
        expect(classifications).toHaveLength(3);
        expect(classifications[0]?.rule).toBe(blockQuoteRule);
        expect(classifications[0]?.index).toBe(0);
        expect(classifications[0]?.length).toBe(1);
        expect(classifications[1]?.rule).toBe(listItemRule);
        expect(classifications[1]?.index).toBe(1);
        expect(classifications[2]?.rule).toBe(blockQuoteRule);
        expect(classifications[2]?.index).toBe(2);
        expect(classifications[2]?.length).toBe(1);
        
        // onAccept should be called twice for the two separate block quotes
        expect(blockQuoteRule.acceptInvocations).toBe(2);
        expect(listItemRule.acceptInvocations).toBe(1);
    });

    it("evaluates higher-priority rules before lower priorities regardless of insertion order", () => {
        // Arrange: paragraph rule is inserted before heading rule but has lower priority
        const cursor = new ArrayCursor(["# Heading"]);
        const headingRule = new HeadingRule();
        const paragraphRule = new ParagraphRule();

        const specification: Specification<string> = {
            rules: [
                createRuleSpecification(paragraphRule, 10),
                createRuleSpecification(headingRule, 80),
            ],
        };

        const evaluationOrder: string[] = [];
        const analyzer = new Analyzer(specification, {
            scoringFunction: (ruleSpecification, matchScore) => {
                evaluationOrder.push(ruleSpecification.rule.name);
                return matchScore;
            },
            overlapResolver: (_current, incoming) => incoming,
        });

        // Act
        analyzer.analyzeCursor(cursor);

        // Assert: heading rule should be evaluated before the lower-priority paragraph rule
        expect(evaluationOrder).toEqual([
            "markdown-heading",
            "markdown-paragraph",
        ]);
    });

    it("resets the shared context cursor before each rule evaluation", () => {
        // Arrange: construct rules where the first mutates the cursor and the second observes it
        class MutatingRule {
            public readonly name = "mutating";
            public readonly type = "mutating";
            public readonly stopWhenMatched = false;
            public matchInvocations = 0;

            match(context: Context<string>): {length: number; score: number} | false {
                const current = context.cursor.peek(0);
                if (undefined === current) {
                    return false;
                }
                this.matchInvocations += 1;
                if (context.cursor.hasNext()) {
                    context.cursor.next();
                }
                return {length: 1, score: 2};
            }

            onAccept(): void {
                // no-op
            }
        }

        class ObserverRule {
            public readonly name = "observer";
            public readonly type = "observer";
            public readonly stopWhenMatched = false;
            public readonly seenIndexes: number[] = [];

            match(context: Context<string>): {length: number; score: number} | false {
                const current = context.cursor.peek(0);
                if (undefined === current) {
                    return false;
                }
                this.seenIndexes.push(context.cursor.getIndex());
                return {length: 1, score: 1};
            }

            onAccept(): void {
                // no-op
            }
        }

        const cursor = new ArrayCursor(["first", "second"]);
        const mutatingRule = new MutatingRule();
        const observerRule = new ObserverRule();

        const specification: Specification<string> = {
            rules: [
                {priority: 50, rule: mutatingRule},
                {priority: 10, rule: observerRule},
            ],
        };

        const analyzer = new Analyzer(specification, {
            scoringFunction: (ruleSpecification, matchScore) => {
                return ruleSpecification.priority + matchScore;
            },
            overlapResolver: (current, incoming) => {
                if (!current) {
                    return incoming;
                }
                return incoming.score >= current.score ? incoming : current;
            },
        });

        // Act
        analyzer.analyzeCursor(cursor);

        // Assert: observer sees the real cursor index on each evaluation regardless of prior mutations
        expect(observerRule.seenIndexes).toEqual([0, 1]);
        expect(mutatingRule.matchInvocations).toBe(2);
    });
});
