/* eslint-disable @typescript-eslint/no-explicit-any */

import { Atom } from 'jotai';
import { Loadable } from 'jotai/vanilla/utils/loadable';

/**
 * Map of string keys and function references with params and returning value.
 */
export type RecordMap = Record<string, (...args: any[]) => unknown>;

/**
 * List of parameter from a source function.
 * @template T - The source map.
 * @template K - The key of the source map.
 */
export type SourceParams<T extends RecordMap, K extends keyof T> = Parameters<
  T[K]
>[0];

/**
 * Return type of a key function from a source map.
 * @template T - The source map.
 * @template K - The key of the method in the source map.
 */
export type SourceReturnType<
  T extends RecordMap,
  K extends keyof T
> = ReturnType<T[K]>;

/**
 * A store object that holds atoms from a source key.
 * @template T - The source map.
 */
export type SourceMap<T extends RecordMap> = {
  [key in keyof T]: Atom<SourceReturnType<T, key>>;
};

/**
 * A store object that holds paramenters from a source key.
 * @template T - The source map.
 */
export type PropMap<T extends RecordMap> = {
  [key in keyof T]: Atom<SourceParams<T, key>>;
};

/**
 * An object containing both source and props maps.
 */
export type SourcePropMap<T extends RecordMap> = {
  source: SourceMap<T>;
  props: PropMap<T>;
};

/**
 * A promise that resolves with a return type of a source function.
 * @template T - The source map.
 * @template K - The key of the source map.
 */
export type StoreReturnPromise<T extends RecordMap, K extends keyof T> = {
  data: Awaited<SourceReturnType<T, K>>;
};

/**
 * A loadable value of a specific source function.
 * @template T - The source map.
 * @template K - The key of the source map.
 */
export type StoreReturnLoadable<
  T extends RecordMap,
  K extends keyof T
> = Loadable<SourceReturnType<T, K>>;

/**
 * An option object that holds the suspense and delay properties.
 */
export type ProxyOptions<S extends boolean> = {
  force?: boolean;
  /**
   * The delay in milliseconds before the data is resolved. Only applys when suspense is set to false.
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
  S extends boolean
> = S extends true ? StoreReturnPromise<T, K> : StoreReturnLoadable<T, K>;
