import * as fs from "node:fs/promises";
import {mkdirSync, readFileSync} from "fs";
import * as path from "node:path";
import {mapWithConcurrency} from "./Utils/MapWithConcurrency.js";
import {DataLineToken, render, type Token, tokenize, TokenType,} from "@rfc-inspector/tokenizer";
import {ArrayCursor} from "@rfc-inspector/common";
import {existsSync} from "node:fs";

const currentWorkingDirectory = process.cwd();

const rfcDirectory = path.join(currentWorkingDirectory, 'rfc');
const outputDirectory = path.join(currentWorkingDirectory, 'output');
const dataDirectory = path.join(currentWorkingDirectory, 'data');
const availableFile = path.join(dataDirectory, 'available.json');
const availableItems: number[] = JSON.parse(readFileSync(availableFile, 'utf-8'));

mkdirSync(rfcDirectory, {recursive: true});
mkdirSync(outputDirectory, {recursive: true});

/****/
/****/
/****/



/****/
/****/
/****/

function collectToc(text: string): Token[] {
    const tokens = Array.from(tokenize(text));
    const cursor = new ArrayCursor(tokens);
    const tocTokens: Token[] = [];
    let isInToc = false;

    while (!cursor.isEOL()) {
        const token = cursor.next();

        if (token.type === TokenType.EOF) {
            break;
        }

        if (token.type === TokenType.DATA_LINE && token.indent === 0) {
            const previousToken = cursor.peek(-2);
            const nextToken = cursor.peek(0);

            if (previousToken?.type === TokenType.BLANK_LINE && nextToken?.type === TokenType.BLANK_LINE) {
                if (isInToc) {
                    isInToc = false;
                    break;
                }

                if (token.data.toLowerCase().startsWith('table of contents')) {
                    isInToc = true;
                }
            }
        }

        if (isInToc) {
            if (token.type === TokenType.FORM_FEED_LINE) {
                // remove previously added line as it is the page footer
                tocTokens.pop();

                // skip the next one
                cursor.skip(1);

                // skip this one
                continue;
            }

            tocTokens.push(token);
        }
    }

    return tocTokens;
}

/****/
/****/
/****/

function ErrorHandler(error: Error) {
    console.error(error);
}

async function main() {
    await mapWithConcurrency(availableItems, async (item) => {
        const filePath = path.join(rfcDirectory, `rfc${item}.txt`);
        const tocFilePath = path.join(outputDirectory, `rfc${item}_toc.txt`);
        const content = await fs.readFile(filePath, 'utf-8');

        const items = new ArrayCursor(collectToc(content));
        const tocTokens = [];

        while (!items.isEOL()) {
            const item = items.next();

            if (item.type === TokenType.EOF) {
                break;
            }

            if (item.type === TokenType.BLANK_LINE) {
                const peek = items.peekForwardUntil(next => next.type === TokenType.DATA_LINE);

                if (peek.length !== 0) {
                    items.skip(peek.length);
                    continue;
                }
            }

            tocTokens.push(item);
        }

        // skip everything until line has thoses rules
        // indent = 0 AND lastToken = BlankLine AND nextToken = BlankLine AND current line = DATA LINE

        // replace 2+ consecutive blank lines

        const text = render(tocTokens).trim();

        if (text.length > 0) {
            await fs.writeFile(tocFilePath, text, 'utf-8');
        } else {
            if (existsSync(tocFilePath)){
                await fs.unlink(tocFilePath);
            }
        }
    }, 100)

}

// Execution
main().catch(ErrorHandler);
