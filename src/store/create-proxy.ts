'use client';

import { SupabaseClient } from '@supabase/supabase-js';
import { Atom, atom, useAtomValue, useSetAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import { Loadable } from 'jotai/vanilla/utils/loadable';
import { isEqual } from 'radash';
import { useCallback, useEffect, useRef } from 'react';
import {
  Proxy,
  ProxyOptions,
  RecordMap,
  SourceParams,
  SourceReturnType,
} from '../models/proxy.model';
import { createReferenceMap, normalizeData } from './utils';

export function createProxy<S extends RecordMap>(
  source: S,
  dbClient: SupabaseClient<never>
) {
  const emptyAtom = atom({});
  const refMap = createReferenceMap(source, dbClient);
  const useProxy = <K extends keyof S, SUSPENSE extends boolean>(
    key: K,
    props?: SourceParams<S, K>,
    options?: ProxyOptions<SUSPENSE>
  ): Proxy<S, K, SUSPENSE> => {
    const existingPropsAtom = useAtomValue(refMap.props[key]);
    const sourceAtom = useRef<
      | Atom<SourceReturnType<S, K> | Loadable<SourceReturnType<S, K>>>
      | Atom<unknown>
    >(emptyAtom);

    useCallback(function initializeAtomProps() {
      /**
       * Initializes the props atom with the provided props.
       */
      if ((props && !isEqual(props, existingPropsAtom)) || options?.force) {
        useSetAtom(refMap.props[key] as never)(props);
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
          sourceAtom.current = refMap.source[key];
          break;
        }
        case false:
        default: {
          sourceAtom.current = loadable(refMap.source[key]);
          break;
        }
      }
    }, [options?.suspense]);

    return normalizeData(
      useAtomValue(sourceAtom.current, {
        delay: (!options?.suspense && options?.delay) || undefined,
      })
    );
  };

  return useProxy;
}
