import {DataLineToken} from "@rfc-inspector/tokenizer";
import {ArrayCursor} from "@rfc-inspector/common";
import {parseTableOfContentsEntry} from "./ParseTableOfContentsEntry.js";

import type {TableOfContentsEntry} from "./TableOfContentsEntry.js";

export function parseTableOfContents(tokens: DataLineToken[]): TableOfContentsEntry[] {
    const entries: TableOfContentsEntry[] = [];
    const cursor = new ArrayCursor(tokens);

    while (!cursor.isEOL()) {
        const token = cursor.next();
        const nextToken = cursor.peek(0);

        const entry = parseTableOfContentsEntry(token.data);

        entry.tokens.push(token);

        if (nextToken !== undefined && undefined === entry.pageNumber) {
            const nextEntry = parseTableOfContentsEntry(nextToken.data);

            // maybe next line?
            if (undefined !== nextEntry && undefined !== nextEntry.pageNumber) {
                entry.sub = [];
                entry.sub.push({...entry, sub: [], tokens: []});

                entry.tokens.push(nextToken);
                entry.sub.push(nextEntry);

                entry.pageNumber = nextEntry.pageNumber;
                entry.title = entry.title + ' ' + nextEntry.title;

                cursor.skip(1);
            }
        }

        entries.push(entry);
    }

    return entries;
}