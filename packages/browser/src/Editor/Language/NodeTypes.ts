import {getEnumValues} from "../../Utils/GetEnumValues.js";
import {NodeType} from "@rfc-inspector/parser";
import {normalizeType} from "../../Utils/NormalizeType.js";

export const nodeTypes = getEnumValues(NodeType)
    .map((type: string) => 'rfc-node-' + normalizeType(type));