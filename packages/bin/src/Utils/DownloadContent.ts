export async function downloadContent(url: string): Promise<string> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to download ${url}: ${response.statusText}`);
    }

    const text = await response.text();

    return text;
}