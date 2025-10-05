import {bench, describe} from "vitest";
import {Parameters, type ParametersRecord} from "../src/index.js";

type LargeParameters = ParametersRecord & Record<string, number>;

const ENTRY_COUNT = 2048;
const DELETE_COUNT = 256;

const bulkData: LargeParameters = Object.fromEntries(
    Array.from({length: ENTRY_COUNT}, (_, index) => [`key-${index}`, index])
);

const keysToRemove = Array.from({length: DELETE_COUNT}, (_, index) => `key-${index * 2}`);

describe("Parameters.delete performance", () => {
    bench("remove many values from a populated parameter bag", () => {
        const parameters = new Parameters<LargeParameters>(bulkData);

        for (let index = 0; index < keysToRemove.length; index++) {
            parameters.delete(keysToRemove[index] as keyof LargeParameters);
        }
    });
});
