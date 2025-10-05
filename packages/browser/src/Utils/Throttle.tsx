export function throttle<T extends (...args: unknown[]) => void>(
    callback: T,
    limit: number
): (...args: Parameters<T>) => void {
    let throttled = false;

    return function (this: unknown, ...args: Parameters<T>) {
        if (throttled) {
            return;
        }

        throttled = true;
        callback.apply(this, args);

        setTimeout(() => {
            throttled = false;
        }, Math.max(0, limit));
    };
}