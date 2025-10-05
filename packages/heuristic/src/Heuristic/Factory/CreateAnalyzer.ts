import type {Specification} from "../Specification.js";
import type {AnalyzerOptions} from "../AnalyzerOptions.js";
import {Analyzer} from "../Analyzer.js";
import {ParametersRecord} from "@rfc-inspector/common";

export function createAnalyzer<
    TItem,
    TType = string,
    TContextParameters extends ParametersRecord = ParametersRecord
>(
    specification: Specification<TItem, TType, TContextParameters>,
    options: Partial<AnalyzerOptions<TItem, TType, TContextParameters>> = {}
): Analyzer<TItem, TType, TContextParameters> {
    const analyzerOptions: AnalyzerOptions<TItem, TType, TContextParameters> = {
        scoringFunction: options.scoringFunction ?? ((ruleSpecification, matchScore) => {
            return ruleSpecification.priority + matchScore;
        }),
        overlapResolver: options.overlapResolver ?? ((current, incoming) => {
            if (!current) {
                return incoming;
            }
            return incoming.score >= current.score ? incoming : current;
        })
    };

    return new Analyzer<TItem, TType, TContextParameters>(
        specification,
        analyzerOptions
    );
}
