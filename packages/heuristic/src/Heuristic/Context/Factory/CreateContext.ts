import {ArrayCursor, Parameters, ParametersRecord} from "@rfc-inspector/common";
import type {Classification} from "../../Classification.js";
import {Context} from "../Context.js";

export function createContext<
    TItem,
    TType = string,
    TContextParameters extends ParametersRecord = ParametersRecord
>(
    cursor: ArrayCursor<TItem>,
    classifications: Classification<TItem, TType, TContextParameters>[] = [],
    parameters?: Parameters<TContextParameters>
): Context<TItem, TType, TContextParameters> {
    return new Context<TItem, TType, TContextParameters>(
        new ArrayCursor(
            cursor.toArray(),
            cursor.getIndex()
        ),
        classifications,
        parameters || new Parameters<TContextParameters>({} as TContextParameters),
    );
}
