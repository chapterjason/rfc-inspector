export function debounce<T extends (...args: unknown[]) => void>(
    callback: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout> | undefined;

    return function (this: unknown, ...args: Parameters<T>) {
        if (timer !== undefined) {
            clearTimeout(timer);
        }

        timer = setTimeout(() => callback.apply(this, args), Math.max(0, wait));
    };
}