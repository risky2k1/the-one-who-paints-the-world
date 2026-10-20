'use strict';

const React = require('react');

const SVG_TAGS = new Set([
  'svg',
  'defs',
  'linearGradient',
  'stop',
  'rect',
  'path',
  'circle',
  'line',
  'text',
  'g',
  'polygon',
  'polyline',
]);

function normalizeChildren(children) {
  const out = [];
  const push = (c) => {
    if (Array.isArray(c)) {
      c.forEach(push);
    } else if (c !== null && c !== undefined && c !== false && c !== true) {
      out.push(c);
    }
  };
  push(children);
  return out;
}

function applyProps(dom, oldProps, newProps, isSvg) {
  const prev = oldProps || {};
  const next = newProps || {};

  Object.keys(prev).forEach((key) => {
    if (key === 'children' || key === 'style' || key.startsWith('on')) return;
    if (!(key in next)) {
      if (key === 'className') {
        dom.removeAttribute('class');
      } else {
        dom.removeAttribute(key);
      }
    }
  });

  Object.keys(next).forEach((key) => {
    if (key === 'children') return;
    const val = next[key];
    if (key.startsWith('on') && typeof val === 'function') {
      const evt = key.slice(2).toLowerCase();
      const evtName =
        evt === 'doubleclick'
          ? 'dblclick'
          : evt === 'mouseenter'
          ? 'mouseover'
          : evt === 'mouseleave'
          ? 'mouseout'
          : evt;
      if (!dom.__handlers) dom.__handlers = {};
      if (!dom.__handlers[evtName]) {
        const dispatcher = (e) => {
          if (!e.currentTarget) {
            try {
              Object.defineProperty(e, 'currentTarget', { value: dom });
            } catch {}
          }
          const fn =
            dom.__handlers &&
            dom.__handlers[evtName] &&
            dom.__handlers[evtName].fn;
          if (typeof fn === 'function') {
            fn(e);
          }
        };
        dom.__handlers[evtName] = { dispatcher, fn: val };
        dom.addEventListener(evtName, dispatcher);
      } else {
        dom.__handlers[evtName].fn = val;
      }
    } else if (key === 'className') {
      if (prev.className !== val) {
        if (val) dom.setAttribute('class', val);
        else dom.removeAttribute('class');
      }
    } else if (key === 'style' && val && typeof val === 'object') {
      const prevStyle = (prev && prev.style) || {};
      Object.keys(prevStyle).forEach((sKey) => {
        if (!(sKey in val)) {
          dom.style[sKey] = '';
        }
      });
      Object.keys(val).forEach((sKey) => {
        if (
          val[sKey] !== undefined &&
          val[sKey] !== null &&
          prevStyle[sKey] !== val[sKey]
        ) {
          dom.style[sKey] = val[sKey];
        }
      });
    } else if (key === 'disabled') {
      if (val) dom.setAttribute('disabled', '');
      else dom.removeAttribute('disabled');
    } else if (val !== undefined && val !== null && val !== false) {
      if (prev[key] !== val) {
        const attrName = isSvg
          ? key === 'strokeWidth'
            ? 'stroke-width'
            : key === 'strokeDasharray'
            ? 'stroke-dasharray'
            : key === 'stopColor'
            ? 'stop-color'
            : key === 'stopOpacity'
            ? 'stop-opacity'
            : key === 'textAnchor'
            ? 'text-anchor'
            : key === 'fontSize'
            ? 'font-size'
            : key === 'fontWeight'
            ? 'font-weight'
            : key
          : key;
        dom.setAttribute(attrName, String(val));
      }
    }
  });
}

function createRoot(container) {
  let rootElement = null;
  let rootFiber = null;
  let updateScheduled = false;
  let pendingEffects = [];

  function scheduleUpdate() {
    if (updateScheduled) return;
    updateScheduled = true;
    Promise.resolve().then(() => {
      updateScheduled = false;
      if (rootElement) {
        renderNow(rootElement);
      }
    });
  }

  function unmountFiber(fiber) {
    if (!fiber) return;
    if (fiber.hooks) {
      fiber.hooks.forEach((h) => {
        if (h && typeof h.cleanup === 'function') {
          try {
            h.cleanup();
          } catch {}
          h.cleanup = null;
        }
      });
    }
    if (fiber.ref && typeof fiber.ref === 'object') {
      fiber.ref.current = null;
    }
    if (fiber.childFibers) {
      fiber.childFibers.forEach(unmountFiber);
    }
  }

  function reconcile(parentDom, oldFiber, vnode, isSvgContext) {
    if (vnode === null || vnode === undefined || typeof vnode === 'boolean') {
      if (oldFiber) {
        unmountFiber(oldFiber);
      }
      return null;
    }

    if (typeof vnode === 'string' || typeof vnode === 'number') {
      const textStr = String(vnode);
      if (oldFiber && oldFiber.type === '#text' && oldFiber.dom) {
        if (oldFiber.text !== textStr) {
          oldFiber.dom.nodeValue = textStr;
          oldFiber.text = textStr;
        }
        return oldFiber;
      }
      if (oldFiber) unmountFiber(oldFiber);
      const dom = document.createTextNode(textStr);
      return {
        type: '#text',
        text: textStr,
        dom,
        childFibers: [],
      };
    }

    if (vnode.type === React.Fragment) {
      const children = normalizeChildren(vnode.props ? vnode.props.children : []);
      const prevChildren =
        oldFiber && oldFiber.type === React.Fragment ? oldFiber.childFibers : [];
      if (oldFiber && oldFiber.type !== React.Fragment) {
        unmountFiber(oldFiber);
      }
      const nextChildFibers = reconcileChildren(
        parentDom,
        prevChildren,
        children,
        isSvgContext
      );
      return {
        type: React.Fragment,
        dom: null,
        childFibers: nextChildFibers,
      };
    }

    if (typeof vnode.type === 'function' && vnode.type.__isContextProvider) {
      const prevMap = React.__getContextMap();
      const nextMap = new Map(prevMap);
      nextMap.set(vnode.type.__context, vnode.props ? vnode.props.value : undefined);
      React.__setContextMap(nextMap);
      try {
        const children = normalizeChildren(
          vnode.props ? vnode.props.children : []
        );
        const prevChildren =
          oldFiber && oldFiber.type === vnode.type ? oldFiber.childFibers : [];
        if (oldFiber && oldFiber.type !== vnode.type) {
          unmountFiber(oldFiber);
        }
        const nextChildFibers = reconcileChildren(
          parentDom,
          prevChildren,
          children,
          isSvgContext
        );
        return {
          type: vnode.type,
          key: vnode.key,
          dom: null,
          childFibers: nextChildFibers,
        };
      } finally {
        React.__setContextMap(prevMap);
      }
    }

    if (typeof vnode.type === 'function') {
      const isSameType =
        oldFiber && oldFiber.type === vnode.type && oldFiber.key === vnode.key;
      if (oldFiber && !isSameType) {
        unmountFiber(oldFiber);
      }
      const fiber = isSameType
        ? oldFiber
        : {
            type: vnode.type,
            key: vnode.key,
            hooks: [],
            scheduleUpdate,
            childFibers: [],
            dom: null,
          };
      fiber.props = vnode.props;
      fiber.scheduleUpdate = scheduleUpdate;

      const rendered = React.__runComponentWithHooks(fiber, () =>
        vnode.type(vnode.props || {})
      );

      if (fiber.hooks) {
        fiber.hooks.forEach((h) => {
          if (h && h.needsRun) {
            pendingEffects.push(h);
          }
        });
      }

      const prevChild =
        fiber.childFibers && fiber.childFibers[0] ? fiber.childFibers[0] : null;
      const nextChild = reconcile(parentDom, prevChild, rendered, isSvgContext);
      fiber.childFibers = nextChild ? [nextChild] : [];
      return fiber;
    }

    if (typeof vnode.type === 'string') {
      const tag = vnode.type;
      const nextIsSvg = isSvgContext || SVG_TAGS.has(tag);
      const isSameDom =
        oldFiber &&
        oldFiber.type === tag &&
        oldFiber.key === vnode.key &&
        oldFiber.dom;

      if (oldFiber && !isSameDom) {
        unmountFiber(oldFiber);
      }

      const dom = isSameDom
        ? oldFiber.dom
        : nextIsSvg
        ? document.createElementNS('http://www.w3.org/2000/svg', tag)
        : document.createElement(tag);

      applyProps(dom, isSameDom ? oldFiber.props : null, vnode.props, nextIsSvg);

      if (vnode.ref) {
        if (typeof vnode.ref === 'function') vnode.ref(dom);
        else if (typeof vnode.ref === 'object') vnode.ref.current = dom;
      }

      const children = normalizeChildren(vnode.props ? vnode.props.children : []);
      const prevChildren = isSameDom ? oldFiber.childFibers || [] : [];
      const nextChildFibers = reconcileChildren(
        dom,
        prevChildren,
        children,
        nextIsSvg
      );
      syncDomChildren(dom, nextChildFibers);

      if (isSameDom) {
        oldFiber.props = vnode.props;
        oldFiber.childFibers = nextChildFibers;
        oldFiber.ref = vnode.ref;
        return oldFiber;
      }

      return {
        type: tag,
        key: vnode.key,
        ref: vnode.ref,
        props: vnode.props,
        dom,
        childFibers: nextChildFibers,
      };
    }

    return null;
  }

  function reconcileChildren(parentDom, prevFibers, nextVNodes, isSvgContext) {
    const out = [];
    const keyedPrev = new Map();
    const unkeyedPrev = [];
    prevFibers.forEach((pf) => {
      if (!pf) return;
      if (pf.key !== null && pf.key !== undefined) {
        keyedPrev.set(pf.key, pf);
      } else {
        unkeyedPrev.push(pf);
      }
    });

    let unkeyedIdx = 0;
    const usedPrev = new Set();

    for (let i = 0; i < nextVNodes.length; i++) {
      const nextV = nextVNodes[i];
      if (nextV === null || nextV === undefined || typeof nextV === 'boolean') {
        continue;
      }
      let matchedOld = null;
      const vKey = nextV && typeof nextV === 'object' ? nextV.key : null;
      if (vKey !== null && vKey !== undefined && keyedPrev.has(vKey)) {
        matchedOld = keyedPrev.get(vKey);
      } else {
        const nextType =
          typeof nextV === 'string' || typeof nextV === 'number'
            ? '#text'
            : nextV.type;
        for (let u = unkeyedIdx; u < unkeyedPrev.length; u++) {
          const cand = unkeyedPrev[u];
          if (!usedPrev.has(cand) && cand.type === nextType) {
            matchedOld = cand;
            unkeyedIdx = u + 1;
            break;
          }
        }
      }
      if (matchedOld) {
        usedPrev.add(matchedOld);
      }
      const reconciled = reconcile(parentDom, matchedOld, nextV, isSvgContext);
      if (reconciled) {
        out.push(reconciled);
      }
    }

    prevFibers.forEach((pf) => {
      if (pf && !usedPrev.has(pf)) {
        unmountFiber(pf);
      }
    });

    return out;
  }

  function collectDomNodes(fiber, list = []) {
    if (!fiber) return list;
    if (fiber.dom) {
      list.push(fiber.dom);
    } else if (fiber.childFibers) {
      fiber.childFibers.forEach((cf) => collectDomNodes(cf, list));
    }
    return list;
  }

  function syncDomChildren(parentDom, childFibers) {
    const desiredNodes = [];
    childFibers.forEach((cf) => collectDomNodes(cf, desiredNodes));

    const currentNodes = Array.from(parentDom.childNodes);
    currentNodes.forEach((node) => {
      if (!desiredNodes.includes(node)) {
        parentDom.removeChild(node);
      }
    });

    desiredNodes.forEach((node, idx) => {
      const currentAtIdx = parentDom.childNodes[idx];
      if (currentAtIdx !== node) {
        parentDom.insertBefore(node, currentAtIdx || null);
      }
    });
  }

  function flushEffects() {
    let guard = 0;
    while (pendingEffects.length > 0 && guard < 5) {
      guard++;
      const toRun = pendingEffects.slice();
      pendingEffects = [];
      toRun.forEach((hook) => {
        if (!hook.needsRun) return;
        hook.needsRun = false;
        if (typeof hook.cleanup === 'function') {
          try {
            hook.cleanup();
          } catch {}
          hook.cleanup = null;
        }
        const cleanup = hook.effect();
        if (typeof cleanup === 'function') {
          hook.cleanup = cleanup;
        }
      });
    }
  }

  function renderNow(element) {
    rootElement = element;
    pendingEffects = [];
    rootFiber = reconcile(container, rootFiber, element, false);
    syncDomChildren(container, rootFiber ? [rootFiber] : []);
    flushEffects();
  }

  return {
    render(element) {
      renderNow(element);
    },
    unmount() {
      if (rootFiber) {
        unmountFiber(rootFiber);
        rootFiber = null;
      }
      container.innerHTML = '';
    },
  };
}

module.exports = {
  createRoot,
};
module.exports.default = { createRoot };
