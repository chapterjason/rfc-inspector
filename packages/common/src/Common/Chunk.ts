export function chunk<T>(items: T[], size: number): T[][] {
    const amount = items.length;
    const chunks: T[][] = [];

    for (let i = 0; i < amount; i += size) {
        chunks.push(items.slice(i, i + size));
    }

    return chunks;
}