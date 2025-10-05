import type {IndexResult} from "./IndexResult.js";

/**
 * Each array item on its own line, compact-serialized.
 * Format:
 * [
 *   <item0>,
 *   <item1>,
 *   ...
 * ]
 * lines[i] = 2 + i
 */
export function stringifyIndex<T>(data: readonly T[]): IndexResult {
    const length = data.length;

    if (length === 0) {
        return {text: "[]", lines: new Uint32Array(0)};
    }

    const items = new Array<string>(length);

    for (let i = 0; i < length; i++) {
        items[i] = JSON.stringify(data[i]) as string;
    }

    const body = "  " + items.join(",\n  ");
    const text = "[\n" + body + "\n]";

    const lines = new Uint32Array(length);

    for (let i = 0; i < length; i++) {
        lines[i] = (2 + i) >>> 0;
    }

    return {text, lines};
}

