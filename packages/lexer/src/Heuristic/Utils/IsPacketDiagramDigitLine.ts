/**
 * @example 0 1 2 3 4 5 6 7
 */
export function isPacketDiagramDigitLine(data: string) {
    data = data.replace(/ /g, '');

    return /^\d+$/.test(data);
}