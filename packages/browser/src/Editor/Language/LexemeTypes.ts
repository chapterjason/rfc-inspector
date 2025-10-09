import {getEnumValues} from "../../Utils/GetEnumValues.js";
import {LexemeType} from "@rfc-inspector/lexer";
import {normalizeType} from "../../Utils/NormalizeType.js";

export const lexemeTypes = getEnumValues(LexemeType)
    .map((type: string) => 'rfc-lexeme-' + normalizeType(type));