import {describe, expect, it} from "vitest";
import {ArrayCursor} from "@rfc-inspector/common";
import {Analyzer} from "../../src/Heuristic/Analyzer.js";
import type {Specification} from "../../src/Heuristic/Specification.js";
import {createRuleSpecification} from "../../src/Heuristic/Factory/CreateRuleSpecification.js";
import {ListItemRule} from "./Rule/Markdown/ListItemRule.js";
import {BlockQuoteRule} from "./Rule/Markdown/BlockQuoteRule.js";

describe("Analyzer with multiline list items containing block quotes", () => {
    it("identifies a multiline list item containing a block quote", () => {
        // Arrange: list item followed by block quote lines
        const lines = [
            "- This is a list item",
            "> This is a block quote inside the list",
            "> Another line of the block quote",
        ];
        const cursor = new ArrayCursor(lines);

        const listItemRule = new ListItemRule();
        const blockQuoteRule = new BlockQuoteRule();

        const specification: Specification<string> = {
            rules: [
                createRuleSpecification(listItemRule, 90),
                createRuleSpecification(blockQuoteRule, 80),
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
        const classifications = analyzer.analyzeCursor(cursor);

        // Assert: list item should be detected first, then block quote
        expect(classifications).toHaveLength(2);

        expect(classifications[0]?.rule).toBe(listItemRule);
        expect(classifications[0]?.index).toBe(0);
        expect(classifications[0]?.length).toBe(1);
        expect(classifications[0]?.rule.type).toBe("LIST_ITEM");
        
        expect(classifications[1]?.rule).toBe(blockQuoteRule);
        expect(classifications[1]?.index).toBe(1);
        expect(classifications[1]?.length).toBe(2);
        expect(classifications[1]?.rule.type).toBe("BLOCK_QUOTE");
        
        expect(listItemRule.matchInvocations).toBeGreaterThanOrEqual(1);
        expect(listItemRule.acceptInvocations).toBe(1);
        expect(blockQuoteRule.matchInvocations).toBeGreaterThanOrEqual(1);
        expect(blockQuoteRule.acceptInvocations).toBe(1);
    });

    it("identifies multiple multiline list items each containing block quotes", () => {
        // Arrange: multiple list items with block quotes
        const lines = [
            "- First list item",
            "> Block quote in first item",
            "- Second list item",
            "> Block quote in second item",
            "> Another line in second block quote",
        ];
        const cursor = new ArrayCursor(lines);

        const listItemRule = new ListItemRule();
        const blockQuoteRule = new BlockQuoteRule();

        const specification: Specification<string> = {
            rules: [
                createRuleSpecification(listItemRule, 90),
                createRuleSpecification(blockQuoteRule, 80),
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
        const classifications = analyzer.analyzeCursor(cursor);

        // Assert: should detect two list items and two block quotes
        expect(classifications).toHaveLength(4);
        
        expect(classifications[0]?.rule.type).toBe("LIST_ITEM");
        expect(classifications[0]?.index).toBe(0);
        expect(classifications[0]?.length).toBe(1);
        
        expect(classifications[1]?.rule.type).toBe("BLOCK_QUOTE");
        expect(classifications[1]?.index).toBe(1);
        expect(classifications[1]?.length).toBe(1);
        
        expect(classifications[2]?.rule.type).toBe("LIST_ITEM");
        expect(classifications[2]?.index).toBe(2);
        expect(classifications[2]?.length).toBe(1);
        
        expect(classifications[3]?.rule.type).toBe("BLOCK_QUOTE");
        expect(classifications[3]?.index).toBe(3);
        expect(classifications[3]?.length).toBe(2);
        
        expect(listItemRule.acceptInvocations).toBe(2);
        expect(blockQuoteRule.acceptInvocations).toBe(2);
    });

    it("identifies a multiline list item followed by indented block quote content", () => {
        // Arrange: list item with indented block quote showing nested structure
        const lines = [
            "* Important note",
            "  with regular content here",
            "  > This is an indented block quote",
            "  > It continues on multiple lines",
            "  and other content here",
            "* Another item",
        ];
        const cursor = new ArrayCursor(lines);

        const listItemRule = new ListItemRule();
        const blockQuoteRule = new BlockQuoteRule();

        const specification: Specification<string> = {
            rules: [
                createRuleSpecification(listItemRule, 20),
                createRuleSpecification(blockQuoteRule, 30),
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
        const classifications = analyzer.analyzeCursor(cursor);

        // Assert: two list items, the first one separated by a block quote
        expect(classifications).toHaveLength(3);
        
        expect(classifications[0]?.rule.type).toBe("LIST_ITEM");
        expect(classifications[0]?.index).toBe(0);
        expect(classifications[0]?.length).toBe(5);

        expect(classifications[1]?.rule.type).toBe("BLOCK_QUOTE");
        expect(classifications[1]?.index).toBe(2);
        expect(classifications[1]?.length).toBe(2);
        
        expect(classifications[2]?.rule.type).toBe("LIST_ITEM");
        expect(classifications[2]?.index).toBe(5);
        expect(classifications[2]?.length).toBe(1);
    });
});
