export type Constructable<TInstance = unknown, TArgs extends unknown[] = unknown[]> = new (...args: TArgs) => TInstance;
