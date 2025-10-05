export function lastWS(s: string, upto: number) {
    for (let i = Math.min(upto, s.length - 1); i >= 0; i--) {
        const c = s[i];
        if (c === ' ' || c === '\t') {
            return i;
        }
    }
    return -1;
}