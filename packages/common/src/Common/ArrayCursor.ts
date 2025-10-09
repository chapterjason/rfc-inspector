import type {Constructable} from "./Constructable.js";

export class ArrayCursor<T> {
    constructor(private items: T[], private index = 0) {
    }

    isEOL(): boolean {
        return this.index >= this.items.length;
    }

    next(): T {
        if (this.isEOL()) {
            throw new Error("End of cursor");
        }

        const item = this.items[this.index];
        if (item === undefined) {
            throw new Error("End of cursor");
        }
        this.index += 1;
        return item;
    }

    prev(): T {
        if (this.index <= 0) {
            throw new Error("Start of cursor");
        }

        this.index -= 1;
        const item = this.items[this.index];
        if (item === undefined) {
            throw new Error("Start of cursor");
        }
        return item;
    }

    hasPrev(): boolean {
        return this.index > 0;
    }

    remaining(): ArrayCursor<T> {
        return new ArrayCursor(this.items.slice(this.index));
    }

    consumed(): ArrayCursor<T> {
        return new ArrayCursor(this.items.slice(0, this.index));
    }

    current(): T {
        if (this.index < 0) {
            throw new Error("Index out of bounds");
        }
        if (this.isEOL()) {
            throw new Error("End of cursor");
        }

        const item = this.items[this.index];
        if (item === undefined) {
            throw new Error("End of cursor");
        }
        return item;
    }

    map<U>(callback: (item: T) => U): ArrayCursor<U> {
        return new ArrayCursor(this.items.map(callback));
    }

    forEach(callback: (item: T) => void): void {
        this.items.forEach(callback);
    }

    hasNext(): boolean {
        return this.index < this.items.length;
    }

    reset() {
        this.index = 0;
    }

    peek(offset = 0): T | undefined {
        const desiredIndex = this.index + offset;

        if (desiredIndex < 0 || desiredIndex >= this.items.length) {
            return undefined;
        }

        return this.items[desiredIndex];
    }

    peekForwardUntil(predicate: (item: T, offset: number, index: number) => boolean): T[] {
        const result: T[] = [];
        const lastIndex = this.items.length - this.index;

        let offset = 0;

        while (offset < lastIndex) {
            const nextItem = this.peek(offset);

            if (undefined === nextItem) {
                break;
            }

            if (predicate(nextItem, offset, this.index + offset)) {
                break;
            }

            result.push(nextItem);

            offset += 1;
        }

        return result;
    }

    readWhile(predicate: (item: T) => boolean): ArrayCursor<T> {
        const result: T[] = [];

        while (!this.isEOL()) {
            const nextItem = this.peek();
            if (undefined === nextItem) {
                break;
            }
            if (!predicate(nextItem)) {
                break;
            }
            result.push(this.next());
        }

        return new ArrayCursor(result);
    }

    readAmount(amount: number): ArrayCursor<T> {
        const result = [];

        for (let i = 0; i < amount; i++) {
            const next = this.peek();

            if (undefined === next) {
                return new ArrayCursor(result);
            }

            result.push(this.next());
        }

        return new ArrayCursor(result);
    }

    skip(amount = 1) {
        const newIndex = this.index + amount;
        if (newIndex < 0 || newIndex > this.items.length) {
            throw new Error("Index out of bounds");
        }
        this.index = newIndex;
    }

    slice(start = 0, end?: number): ArrayCursor<T> {
        const sliceEnd = end ?? this.items.length;
        return new ArrayCursor(this.items.slice(start, sliceEnd));
    }

    // Getter
    getIndex() {
        return this.index;
    }

    getLength() {
        return this.items.length;
    }

    setIndex(index: number) {
        if (index < 0 || index > this.items.length) {
            throw new Error("Index out of bounds");
        }
        this.index = index;
    }

    toArray(): T[] {
        return this.items;
    }

    findIndex(predicate: (item: T) => boolean): number {
        return this.items.findIndex(predicate);
    }

    [Symbol.iterator]() {
        return {
            next: () => {
                if (this.isEOL()) {
                    return {done: true, value: ""};
                }

                return {done: false, value: this.next()};
            }
        };
    }

    * stream(): Generator<T, void, void> {
        while (!this.isEOL()) {
            yield this.next();
        }
    }

    // Some validation functions

    validate(predicate: (item: T) => boolean): boolean {
        return this.items.every(predicate);
    }

    instanceOf(type: Constructable): boolean {
        return this.validate(item => item instanceof type);
    }

    includes(value: T): boolean {
        return this.items.includes(value);
    }

    includesInstanceOf(type: Constructable): boolean {
        return this.items.some(item => item instanceof type);
    }

    // Visualize

    print() {
        const visualization = this.items.map((item, i) => {
            if (i === this.index) {
                return {CURRENT: item};
            }
            return {[i]: item};
        });

        console.dir(
            {
                index: this.index,
                items: visualization
            },
            {depth: null}
        );

    }
}
