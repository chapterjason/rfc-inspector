export function stringifyCompact<T>(data: readonly T[]): string {
    const length = data.length;
    if (length === 0) {
        return "[]";
    }

    let result = "[\n  ";

    for (let i = 0; i < length; i++) {
        const line = JSON.stringify(data[i]);

        result += line === undefined ? "null" : line;

        if (i !== length - 1) {
            result += ",\n  ";
        }
    }

    return result + "\n]";
}