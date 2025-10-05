import type {Specification} from "./Specification.js";
import type {Classification} from "./Classification.js";
import type {AnalyzerOptions} from "./AnalyzerOptions.js";
import type {RuleSpecification} from "./RuleSpecification.js";
import {ArrayCursor, Parameters, ParametersRecord} from "@rfc-inspector/common";
import {createClassification} from "./Factory/CreateClassification.js";
import {createContext} from "./Context/Factory/CreateContext.js";

export class Analyzer<
    TItem,
    TType = string,
    TContextParameters extends ParametersRecord = ParametersRecord
> {
    private readonly specification: Specification<TItem, TType, TContextParameters>;
    private readonly options: AnalyzerOptions<TItem, TType, TContextParameters>;
    private readonly orderedRules: RuleSpecification<TItem, TType, TContextParameters>[];

    constructor(
        specification: Specification<TItem, TType, TContextParameters>,
        options: AnalyzerOptions<TItem, TType, TContextParameters>
    ) {
        this.specification = specification;
        this.options = options;
        this.orderedRules = this.orderRules(specification.rules);
    }

    analyzeCursor(cursor: ArrayCursor<TItem>): Classification<TItem, TType, TContextParameters>[] {
        const classifications: Classification<TItem, TType, TContextParameters>[] = [];
        const parameters = new Parameters<TContextParameters>();
        const context = createContext(cursor, classifications, parameters);
        const classifiedAt = new Set<string>();

        while (!cursor.isEOL()) {
            const currentIndex = cursor.getIndex();

            context.cursor.setIndex(currentIndex);
            const matches: Classification<TItem, TType, TContextParameters>[] = [];

            for (const ruleSpecification of this.orderedRules) {
                context.cursor.setIndex(currentIndex);
                const {rule} = ruleSpecification;
                const result = rule.match(context);

                if (!result) {
                    continue;
                }

                const score = this.options.scoringFunction(ruleSpecification, result.score);
                const length = Math.max(1, result.length);

                const classification = createClassification<TItem, TType, TContextParameters>(
                    rule,
                    currentIndex,
                    score,
                    length,
                    result
                );

                matches.push(classification);

                if (rule.stopWhenMatched) {
                    break;
                }
            }

            if (matches.length === 0) {
                const coveringClassification = this.findCoveringClassification(classifications, currentIndex);
                
                if (!coveringClassification) {
                    console.dir({
                        [currentIndex]: cursor.peek(0),
                    }, {depth: null});

                    throw new Error(`No rule matched at index ${currentIndex}`);
                }
                cursor.skip(1);
            } else {
                let best = matches[0];

                for (let index = 1; index < matches.length; index += 1) {
                    const current = matches[index];
                    if (this.options.overlapResolver(best, current) === current) {
                        best = current;
                    }
                }

                const classificationKey = `${best.index}:${best.rule.name}`;
                
                if (!classifiedAt.has(classificationKey)) {
                    const willMerge = this.willMergeWithPrevious(classifications, best);
                    
                    if (!willMerge) {
                        best.rule.onAccept(context, best);
                    }
                    
                    classifications.push(best);
                    classifiedAt.add(classificationKey);
                }
                
                if (best.rule.stopWhenMatched) {
                    cursor.skip(best.length);
                } else {
                    cursor.skip(1);
                }
            }
        }

        return this.mergeClassifications(classifications);
    }

    private willMergeWithPrevious(
        classifications: Classification<TItem, TType, TContextParameters>[],
        classification: Classification<TItem, TType, TContextParameters>
    ): boolean {
        if (classifications.length === 0) {
            return false;
        }

        const last = classifications[classifications.length - 1];
        
        if (last.rule.name !== classification.rule.name || last.rule.type !== classification.rule.type) {
            return false;
        }
        
        const lastEnd = last.index + last.length;
        const currentStart = classification.index;
        
        return currentStart >= last.index && currentStart <= lastEnd;
    }

    private mergeClassifications(
        classifications: Classification<TItem, TType, TContextParameters>[]
    ): Classification<TItem, TType, TContextParameters>[] {
        if (classifications.length === 0) {
            return classifications;
        }

        const sorted = classifications.slice().sort((a, b) => {
            if (a.index !== b.index) {
                return a.index - b.index;
            }
            return b.score - a.score;
        });

        const merged: Classification<TItem, TType, TContextParameters>[] = [];
        
        for (const classification of sorted) {
            const last = merged[merged.length - 1];
            
            if (!last) {
                merged.push(classification);
                continue;
            }
            
            if (last.rule.name === classification.rule.name && last.rule.type === classification.rule.type) {
                const lastEnd = last.index + last.length;
                const currentStart = classification.index;
                
                if (currentStart >= last.index && currentStart <= lastEnd) {
                    const currentEnd = classification.index + classification.length;
                    const newEnd = Math.max(lastEnd, currentEnd);
                    last.length = newEnd - last.index;
                    continue;
                }
            }
            
            merged.push(classification);
        }
        
        return merged;
    }

    private findCoveringClassification(
        classifications: Classification<TItem, TType, TContextParameters>[],
        targetIndex: number
    ): Classification<TItem, TType, TContextParameters> | null {
        for (const classification of classifications) {
            if (targetIndex >= classification.index && targetIndex < classification.index + classification.length) {
                return classification;
            }
        }
        return null;
    }

    private orderRules(
        rules: RuleSpecification<TItem, TType, TContextParameters>[]
    ): RuleSpecification<TItem, TType, TContextParameters>[] {
        return rules
            .map((rule, index) => ({rule, index}))
            .sort((left, right) => {
                if (left.rule.priority === right.rule.priority) {
                    return left.index - right.index;
                }
                return right.rule.priority - left.rule.priority;
            })
            .map(entry => entry.rule);
    }
}
