'use strict';

let currentComponent = null;
let hookIndex = 0;
let currentContextMap = new Map();

function createElement(type, props, ...children) {
  const normalizedProps = Object.assign({}, props || {});
  const flatChildren = [];
  const pushChild = (c) => {
    if (Array.isArray(c)) {
      c.forEach(pushChild);
    } else if (c !== null && c !== undefined && c !== false && c !== true) {
      flatChildren.push(c);
    }
  };
  children.forEach(pushChild);
  if (flatChildren.length === 1) {
    normalizedProps.children = flatChildren[0];
  } else if (flatChildren.length > 1) {
    normalizedProps.children = flatChildren;
  }
  const ref = normalizedProps.ref || null;
  const key = normalizedProps.key !== undefined ? String(normalizedProps.key) : null;
  delete normalizedProps.key;
  delete normalizedProps.ref;
  return {
    $$typeof: 'react.element',
    type,
    key,
    ref,
    props: normalizedProps,
  };
}

const Fragment = Symbol.for('react.fragment');

function getHookState() {
  if (!currentComponent) {
    throw new Error('Hooks can only be called inside a function component');
  }
  const idx = hookIndex++;
  if (!currentComponent.hooks) {
    currentComponent.hooks = [];
  }
  return { instance: currentComponent, idx };
}

function depsChanged(oldDeps, newDeps) {
  if (!oldDeps || !newDeps) return true;
  if (oldDeps.length !== newDeps.length) return true;
  for (let i = 0; i < oldDeps.length; i++) {
    if (!Object.is(oldDeps[i], newDeps[i])) return true;
  }
  return false;
}

function useState(initialState) {
  const { instance, idx } = getHookState();
  if (instance.hooks.length <= idx) {
    const val =
      typeof initialState === 'function' ? initialState() : initialState;
    const setState = (updater) => {
      const hook = instance.hooks[idx];
      const nextVal =
        typeof updater === 'function' ? updater(hook.value) : updater;
      if (!Object.is(hook.value, nextVal)) {
        hook.value = nextVal;
        if (instance.scheduleUpdate) {
          instance.scheduleUpdate();
        }
      }
    };
    instance.hooks[idx] = { value: val, setState };
  }
  const hook = instance.hooks[idx];
  return [hook.value, hook.setState];
}

function useReducer(reducer, initialArg, init) {
  const { instance, idx } = getHookState();
  if (instance.hooks.length <= idx) {
    const initialState =
      typeof init === 'function' ? init(initialArg) : initialArg;
    const dispatch = (action) => {
      const hook = instance.hooks[idx];
      const nextState = hook.reducer(hook.state, action);
      if (!Object.is(hook.state, nextState)) {
        hook.state = nextState;
        if (instance.scheduleUpdate) {
          instance.scheduleUpdate();
        }
      }
    };
    instance.hooks[idx] = { state: initialState, reducer, dispatch };
  }
  const hook = instance.hooks[idx];
  hook.reducer = reducer;
  return [hook.state, hook.dispatch];
}

function useRef(initialValue) {
  const { instance, idx } = getHookState();
  if (instance.hooks.length <= idx) {
    instance.hooks[idx] = { current: initialValue };
  }
  return instance.hooks[idx];
}

function useMemo(factory, deps) {
  const { instance, idx } = getHookState();
  const prev = instance.hooks[idx];
  if (!prev || depsChanged(prev.deps, deps)) {
    const value = factory();
    instance.hooks[idx] = { value, deps };
    return value;
  }
  return prev.value;
}

function useCallback(callback, deps) {
  return useMemo(() => callback, deps);
}

function useEffect(effect, deps) {
  const { instance, idx } = getHookState();
  const prev = instance.hooks[idx];
  if (!prev || depsChanged(prev.deps, deps)) {
    instance.hooks[idx] = {
      effect,
      deps,
      cleanup: prev ? prev.cleanup : null,
      needsRun: true,
    };
  }
}

function createContext(defaultValue) {
  function Provider(props) {
    return props.children || null;
  }
  const ctx = {
    _defaultValue: defaultValue,
    Provider,
  };
  Provider.__isContextProvider = true;
  Provider.__context = ctx;
  return ctx;
}

function useContext(ctx) {
  if (currentContextMap && currentContextMap.has(ctx)) {
    return currentContextMap.get(ctx);
  }
  return ctx._defaultValue;
}

function __runComponentWithHooks(instance, renderFn) {
  const prevComp = currentComponent;
  const prevIdx = hookIndex;
  currentComponent = instance;
  hookIndex = 0;
  try {
    return renderFn();
  } finally {
    currentComponent = prevComp;
    hookIndex = prevIdx;
  }
}

function __getContextMap() {
  return currentContextMap;
}

function __setContextMap(map) {
  currentContextMap = map;
}

const React = {
  createElement,
  Fragment,
  useState,
  useReducer,
  useRef,
  useMemo,
  useCallback,
  useEffect,
  createContext,
  useContext,
  __runComponentWithHooks,
  __getContextMap,
  __setContextMap,
};

module.exports = React;
module.exports.default = React;
