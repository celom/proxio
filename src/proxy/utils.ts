/* eslint-disable @typescript-eslint/no-explicit-any */

import { Atom, atom } from 'jotai';
import {
  PropMap,
  RecordMap,
  SourceMap,
  SourceParams,
  SourcePropMap,
  SourceReturnType,
} from './proxy.model';

/**
 * Creates a prop map object that contains atoms for each function params in the source object.
 */
export function createPropsMap<S extends RecordMap>(source: S): PropMap<S> {
  const propsMap: PropMap<S> = {} as PropMap<S>;
  for (const key in source) {
    propsMap[key] = atom({}) satisfies Atom<SourceParams<S, keyof S>>;
  }
  return propsMap;
}

/**
 * Creates a reference object mapping the atoms of each source function with their matching props.
 */
export function createReferenceMap<S extends RecordMap>(
  sourceRef: S,
  ...args: any[]
): SourcePropMap<S> {
  const props = createPropsMap(sourceRef);
  const source = {} as SourceMap<S>;
  for (const key in sourceRef) {
    source[key] = atom(async (get) =>
      sourceRef[key](get(props[key]), args)
    ) as Atom<SourceReturnType<S, keyof S>>;
  }
  return { source, props };
}

/**
 * Normalizes the output to ensure that the response is always
 * wrapped in a data object, confirming to the Loadable type.
 */
export function normalizeData(source: any) {
  const { state, count, data: sourceData, error } = source;
  const data = state ? sourceData : { count, data: sourceData };
  return { state, data, error };
}
