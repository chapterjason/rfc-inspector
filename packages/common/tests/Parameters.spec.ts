import {describe, expect, it} from "vitest";
import {Parameters, type ParametersRecord} from "../src/index.js";

interface TestParameters extends ParametersRecord {
    flag: boolean;
    count: number;
}

describe("Parameters", () => {
    it("stores, retrieves, and reports values", () => {
        // Arrange: seed parameters with an initial payload
        const parameters = new Parameters<TestParameters>({flag: false});

        // Act: update and interrogate the parameter bag
        parameters.set("flag", true);
        const flag = parameters.get("flag");
        const hasFlag = parameters.has("flag");

        // Assert: value was replaced, and availability reported
        expect(flag).toBe(true);
        expect(hasFlag).toBe(true);
        expect(parameters.getAll()).toEqual({flag: true});
    });

    it("merges updates and prunes entries", () => {
        // Arrange: create a parameter bag with multiple entries
        const parameters = new Parameters<TestParameters>({flag: true, count: 1});

        // Act: merge new values and delete the flag entry
        parameters.merge({count: 2});
        parameters.delete("flag");

        // Assert: merged value is visible and deleted key removed
        expect(parameters.get("count")).toBe(2);
        expect(parameters.has("flag")).toBe(false);
        expect(parameters.getAll()).toEqual({count: 2});
    });

    it("clears state back to empty", () => {
        // Arrange: populate parameters with data
        const parameters = new Parameters<TestParameters>({flag: true});

        // Act: clear all entries
        parameters.clear();

        // Assert: bag is empty after clearing
        expect(parameters.getAll()).toEqual({});
        expect(parameters.has("flag")).toBe(false);
    });
});
