import fs from "node:fs";
import {downloadContent} from "./DownloadContent.js";

export async function downloadFile(url: string, file: string) {
    if (fs.existsSync(file)) {
        return fs.readFileSync(file, 'utf-8');
    }

    const content = await downloadContent(url);

    fs.writeFileSync(file, content);

    return content;
}