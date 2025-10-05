import {describe, expect, it} from "vitest";
import {createPeekResult} from "../../../../src/Heuristic/Context/Factory/CreatePeekResult.js";

describe("createPeekResult", () => {
    it("returns a tuple containing the index and item", () => {
        // Act
        const peekResult = createPeekResult(7, {value: "line"});

        // Assert
        expect(peekResult).toEqual({
            index: 7,
            item: {value: "line"},
        });
    });
});
