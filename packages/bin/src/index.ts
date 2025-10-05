import * as fs from "node:fs/promises";
import {mkdirSync, readFileSync} from "fs";
import * as path from "node:path";
import {mapWithConcurrency} from "./Utils/MapWithConcurrency.js";
import {render, type Token, tokenize, TokenType,} from "@rfc-inspector/tokenizer";
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

function ErrorHandler(error: Error) {
    console.error(error);
}

async function main() {
    await mapWithConcurrency(availableItems, async (item) => {
        const filePath = path.join(rfcDirectory, `rfc${item}.txt`);
        const tocFilePath = path.join(outputDirectory, `rfc${item}_toc.txt`);
        const content = await fs.readFile(filePath, 'utf-8');
        const tokens = Array.from(tokenize(content));
        const cursor = new ArrayCursor(tokens);

        // skip everything until line has thoses rules
        // indent = 0 AND lastToken = BlankLine AND nextToken = BlankLine AND current line = DATA LINE
        const tocTokens: Token[] = [];
        let isInToc = false;

        while (!cursor.isEOL()) {
            const token = cursor.next();

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
                tocTokens.push(token);
            }
        }

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
