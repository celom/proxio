'use client';

import { SupabaseClient } from '@supabase/supabase-js';
import { Atom, atom, useAtomValue, useSetAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import { Loadable } from 'jotai/vanilla/utils/loadable';
import { isEqual } from 'radash';
import { useCallback, useEffect, useRef } from 'react';
import {
  RecordMap,
  SourceParams,
  SourceReturnType,
  Store,
  StoreOptions,
} from '../models/store.model';
import { createSourceMap, normalizeData } from './utils';

/**
 * Creates a store used to fetch and manage Supabase data,
 * with the provided source and Supabase client.
 * 
 * @param source - The source reference object of functions with Supabase queries.
 * @param dbClient - The Supabase client to be used for the store.
 * @returns A function that is used to fetch and manage Supabase data.
 * @example
 * ```tsx
 * import { createBrowserClient } from "@supabase/ssr";
 * import { createStore } from '../store/create-store';
 * import sources from './sources';
 * 
 * export const useStore = createStore(
 *   { ...sources },
 *   createBrowserClient('supabaseUrl', 'supabaseKey'),
 * );
 * const useStore = createStore(source, dbClient);
 * 
 * const Component = () => {
 *  const data = useStore('key');
 * return <div>{data}</div>;
 * };
 * ```
 */
export function createStore<S extends RecordMap>(
  source: S,
  dbClient: SupabaseClient<never>,
) {
  const emptyAtom = atom({});
  const store = createSourceMap(source, dbClient);
  const useStore = <K extends keyof S, SUSPENSE extends boolean>(
    key: K,
    props?: SourceParams<S, K>,
    options?: StoreOptions<SUSPENSE>,
  ): Store<S, K, SUSPENSE> => {
    const existingPropsAtom = useAtomValue(store.props[key]);
    const sourceAtom = useRef<
      | Atom<SourceReturnType<S, K> | Loadable<SourceReturnType<S, K>>>
      | Atom<unknown>
    >(emptyAtom);

    useCallback(function initializeAtomProps() {
      /**
       * Because the props atom is a dependency for the source atom,
       * it is set only if its value differs from the existing value.
       * 
       * This is to assure that the source atom is not re-initialized
       * if the props value is the same.
       */
      if ((props && !isEqual(props, existingPropsAtom)) || options?.force) {
        useSetAtom(store.props[key] as never)(props);
      }
    }, [])();

    useEffect(() => {
      /**
       * During the hydration process, there can be a racing condition that causes a mismatch
       * of Supabase data object value between the server and client. To overcome this issue, the atom
       * is set after the hydration process is completed. The useEffect hook is used to ensure this timing.
       */
      switch (options?.suspense) {
        case true: {
          sourceAtom.current = store.source[key];
          break;
        }
        case false:
        default: {
          sourceAtom.current = loadable(store.source[key]);
          break;
        }
      }
    }, [options?.suspense]);

    return normalizeData(
      useAtomValue(sourceAtom.current, {
        delay: (!options?.suspense && options?.delay) || undefined,
      }),
    );
  };

  return useStore;
}
