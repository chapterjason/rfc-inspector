import {parseNumbering} from "./ParseNumbering.js";
import {parseSpacing} from "./ParseSpacing.js";
import {parsePaging} from "./ParsePaging.js";

import type {TableOfContentsEntry} from "./TableOfContentsEntry.js";

export function parseTableOfContentsEntry(text: string): TableOfContentsEntry {
    const numbering = parseNumbering(text)
    const spacing = parseSpacing(text);
    const pageNumber = parsePaging(text);
    let title = text;

    if (undefined !== numbering) {
        title = title.replace(numbering, '');
    }

    if (undefined !== spacing) {
        title = title.replace(spacing, '');
    }

    if (undefined !== pageNumber) {
        title = title.replace(pageNumber, '');
    }

    return {
        numbering,
        title,
        pageNumber,

        tokens: [],
    }
}