import {createDomain, createStore} from "effector";
import {effects, stores} from "../../server/effects";
import React from "react";

export const ssrDomain = createDomain('SSR');

ssrDomain.onCreateStore(store => {
  if (typeof window !== 'undefined') {
    const state = window.__PRELOADED_STATE__;
    if (state && state[store.sid]) {
      store.setState(state[store.sid]);
    }
  } else {
    stores[store.sid] = store;
  }
});

export const useSsrEffect = (eff, deps) => {
  const hasHydrated = React.useRef(true);
  if (typeof window !== 'undefined') {
    React.useEffect(() => {
      if (hasHydrated.current) {
        hasHydrated.current = false;
      } else {
        eff();
      }
    }, deps);
  } else {
    effects.push(eff);
  }
};

// DEPRECATED
export const createSsrStore = (defaultState, config) => {
  const store = createStore(defaultState, config);

  if (typeof window !== 'undefined') {
    const state = window.__PRELOADED_STATE__;
    if (state && state[store.sid]) {
      store.setState(state[store.sid]);
    }
  } else {
    stores[store.sid] = store;
  }

  return store;
};
