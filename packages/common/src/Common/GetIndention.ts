
export function getIndention(text: string): number {
    let index = 0;

    while (index < text.length && text.charCodeAt(index) === 32) {
        index++;
    }

    return index;
}