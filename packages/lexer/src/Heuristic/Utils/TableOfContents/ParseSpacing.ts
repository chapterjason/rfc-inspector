
const spacingExpression = /[ .]{4,}/;

export function parseSpacing(text: string): string | undefined {
    const match = spacingExpression.exec(text);

    if (null !== match) {
        return match[0];
    }

    return undefined;
}