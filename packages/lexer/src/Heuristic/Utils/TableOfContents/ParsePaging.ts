
const pagingExpression = /[ .]{3,}([0-9]+)/;

export function parsePaging(text: string): string | undefined {
    const match = pagingExpression.exec(text);

    if (null !== match) {
        return match[1];
    }

    return undefined;
}