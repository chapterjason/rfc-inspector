import type {PeekResult} from "../PeekResult.js";

export function createPeekResult<TItem>(index: number, item: TItem): PeekResult<TItem> {
    return {index, item};
}
