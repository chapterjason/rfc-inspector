import {ArrayCursor, Parameters, type ParametersRecord} from "@rfc-inspector/common";
import {createPeekResult} from "./Factory/CreatePeekResult.js";
import type {PeekResult} from "./PeekResult.js";
import type {Classification} from "../Classification.js";

export class Context<
    TItem,
    TType = string,
    TContextParameters extends ParametersRecord = ParametersRecord
> {
    public readonly cursor: ArrayCursor<TItem>;
    public readonly classifications: Classification<TItem, TType, TContextParameters>[];
    public readonly parameters: Parameters<TContextParameters>;
    private lastLookupPosition: number | null = null;
    private lastLookupHit: Classification<TItem, TType, TContextParameters> | null = null;

    constructor(
        cursor: ArrayCursor<TItem>,
        classifications: Classification<TItem, TType, TContextParameters>[],
        parameters: Parameters<TContextParameters>
    ) {
        this.cursor = cursor;
        this.classifications = classifications;
        this.parameters = parameters;
        if (classifications.length > 0) {
            const position = classifications.length - 1;
            this.lastLookupPosition = position;
            this.lastLookupHit = classifications[position];
        }
    }

    countUntil(predicate: (item: TItem | undefined) => boolean): number {
        let count = 0;
        const max = this.cursor.getLength() - this.cursor.getIndex();

        for (let index = 0; index < max; index++) {
            const line = this.cursor.peek(index);

            if (predicate(line)) {
                break;
            }

            count++;
        }

        return count;
    }

    getLatestClassification(): Classification<TItem, TType, TContextParameters> | undefined {
        if (this.classifications.length === 0) {
            return undefined;
        }

        return this.classifications[this.classifications.length - 1];
    }

    findClassificationAtIndex(index: number): Classification<TItem, TType, TContextParameters> | null {
        if (this.classifications.length === 0) {
            return null;
        }

        if (null !== this.lastLookupPosition && null !== this.lastLookupHit) {
            const cached = this.inspectClassificationHit(this.lastLookupHit, index, this.lastLookupPosition);
            if (cached) {
                return cached;
            }

            const nextPosition = this.lastLookupPosition + 1;
            if (nextPosition < this.classifications.length) {
                const forwardMatch = this.scanForwardFrom(nextPosition, index);
                if (forwardMatch) {
                    return forwardMatch;
                }
            }
        }

        const match = this.scanForwardFrom(0, index);
        if (match) {
            return match;
        }

        return null;
    }

    getNextMatchingItem(
        maxLookahead: number,
        predicate: (item: TItem, index: number) => boolean
    ): PeekResult<TItem> | null {
        for (let step = 1; step <= maxLookahead; step += 1) {
            const item = this.cursor.peek(step);

            if (undefined === item) {
                break;
            }

            const absoluteIndex = this.cursor.getIndex() + step;
            if (predicate(item, absoluteIndex)) {
                return createPeekResult(absoluteIndex, item);
            }
        }
        return null;
    }

    private inspectClassificationHit(
        classification: Classification<TItem, TType, TContextParameters>,
        index: number,
        position: number
    ): Classification<TItem, TType, TContextParameters> | null {
        if (
            index >= classification.index &&
            index < classification.index + classification.length
        ) {
            this.lastLookupPosition = position;
            this.lastLookupHit = classification;
            return classification;
        }

        return null;
    }

    private scanForwardFrom(
        startPosition: number,
        target: number
    ): Classification<TItem, TType, TContextParameters> | null {
        for (let position = startPosition; position < this.classifications.length; position += 1) {
            const candidate = this.classifications[position];
            const hit = this.inspectClassificationHit(candidate, target, position);

            if (hit) {
                return hit;
            }

            if (target < candidate.index) {
                return null;
            }
        }

        return null;
    }
}
