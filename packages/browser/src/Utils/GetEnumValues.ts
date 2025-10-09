export function getEnumValues(instance: object): string[] {
    return Object.values(instance).filter((value: string | number) => isNaN(Number(value)));
}