export function normalizeType(type: string): string {
    return type.toLowerCase().replace(/_/g, '-');
}