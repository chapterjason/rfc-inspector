export function hasTypeProperty<T>(value: unknown): value is { type: T } {
    return (value as { type?: T }).type !== undefined;
}