import type {ParametersRecord} from "./ParametersRecord.js";

export class Parameters<TContextParameters extends ParametersRecord = ParametersRecord> {
    private values: Partial<TContextParameters>;

    constructor(initial: Partial<TContextParameters> = {}) {
        this.values = {...initial};
    }

    get<Key extends keyof TContextParameters>(key: Key): TContextParameters[Key] | undefined {
        return this.values[key];
    }

    set<Key extends keyof TContextParameters>(key: Key, value: TContextParameters[Key]): void {
        this.values[key] = value;
    }

    has<Key extends keyof TContextParameters>(key: Key): boolean {
        return Object.prototype.hasOwnProperty.call(this.values, key);
    }

    getAll(): Readonly<Partial<TContextParameters>> {
        return {...this.values};
    }

    merge(newParameters: Partial<TContextParameters>): void {
        this.values = {...this.values, ...newParameters};
    }

    clear(): void {
        this.values = {};
    }

    delete<Key extends keyof TContextParameters>(key: Key): void {
        if (!this.has(key)) {
            return;
        }

        delete this.values[key];
    }
}
