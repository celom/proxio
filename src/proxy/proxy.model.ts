import { Atom } from 'jotai';
import { Loadable } from 'jotai/vanilla/utils/loadable';

/**
 * A type that maps string keys to methods that accept any number of arguments and return an value.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RecordMap = Record<string, (...args: any[]) => unknown>;
/**
 * The type of parameters for a specific source method.
 * @template T - The source map.
 * @template K - The key of the source map.
 */
export type SourceParams<T extends RecordMap, K extends keyof T> = Parameters<
    T[K]
>[0];
/**
 * The return type of a specific method in a source map.
 * @template T - The source map.
 * @template K - The key of the method in the source map.
 */
export type SourceReturnType<
    T extends RecordMap,
    K extends keyof T,
> = ReturnType<T[K]>;

/**
 * A store object that holds the matching atoms with a specific source key.
 * @template T - The source map.
 */
export type SourceMap<T extends RecordMap> = {
    [key in keyof T]: Atom<SourceReturnType<T, key>>;
};
/**
 * A store object that holds the paramenters of a specific source key method.
 * @template T - The source map.
 */
export type PropMap<T extends RecordMap> = {
    // [key in keyof SourceMap]: Atom<SourceParams<S, key>>;
    [key in keyof T]: Atom<SourceParams<T, key>>;
};
/**
 * A store prop map object that contains the source and props maps.
 */
export type SourcePropMap<T extends RecordMap> = {
    source: SourceMap<T>;
    props: PropMap<T>;
};
/**
 * A promise that resolves to the return type of a source method.
 * @template T - The source map.
 * @template K - The key of the source map.
 */
export type StoreReturnPromise<T extends RecordMap, K extends keyof T> = {
    data: Awaited<SourceReturnType<T, K>>;
};
/**
 * A loadable value of a specific source method.
 * @template T - The source map.
 * @template K - The key of the source map.
 */
export type StoreReturnLoadable<
    T extends RecordMap,
    K extends keyof T,
> = Loadable<SourceReturnType<T, K>>;
/**
 * An option object that holds the suspense and delay properties.
 */
export type ProxyOptions<S extends boolean> = {
    force?: boolean;
    /**
     * The delay in milliseconds before the data is resolved. It is only applied when suspense is false.
     */
    delay?: number;
    suspense?: S;
};
/**
 * The return type of a store method.
 * @template T - The source map.
 * @template K - The key of the source map.
 * @template S - A boolean flag indicating whether the return type should be loadable or a promise.
 */
export type Proxy<
    T extends RecordMap,
    K extends keyof T,
    S extends boolean,
> = S extends true ? StoreReturnPromise<T, K> : StoreReturnLoadable<T, K>;
