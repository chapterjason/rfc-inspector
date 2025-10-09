import {getEnumValues} from "../../Utils/GetEnumValues.js";
import {TokenType} from "@rfc-inspector/tokenizer";
import {normalizeType} from "../../Utils/NormalizeType.js";

export const tokenTypes = getEnumValues(TokenType)
    .map((type: string) => 'rfc-token-' + normalizeType(type));