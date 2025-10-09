import type {RangeProvider} from "./RangeProvider.js";

export const regexRanges = (re: RegExp): RangeProvider => m =>
    m.findMatches(re.source, false, /*isRegex*/ true, /*matchCase*/ false, /*wordSeps*/ null, /*capture*/ false)
        .map(x => x.range);