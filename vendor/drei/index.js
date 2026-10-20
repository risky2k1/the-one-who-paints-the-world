'use strict';

const React = require('react');
const {
  R3FContext,
  GroupStackContext,
  transformPointLocalToWorld,
  buildCameraBasis,
  projectWorldToScreen,
} = require('@react-three/fiber');

function Html(props) {
  const engine = React.useContext(R3FContext);
  const stack = React.useContext(GroupStackContext);
  const domRef = React.useRef(null);
  const entryRef = React.useRef(null);

  const pos = Array.isArray(props.position)
    ? {
        x: props.position[0] || 0,
        y: props.position[1] || 0,
        z: props.position[2] || 0,
      }
    : { x: 0, y: 0, z: 0 };

  if (!entryRef.current) {
    entryRef.current = {
      dom: null,
      stack,
      localPosition: pos,
    };
  }
  entryRef.current.stack = stack;
  entryRef.current.localPosition = pos;

  React.useEffect(() => {
    if (!engine || !domRef.current) return;
    if (!engine.htmlNodes) {
      engine.htmlNodes = new Set();
    }
    const entry = entryRef.current;
    entry.dom = domRef.current;

    const cam = engine.store.camera;
    const basis = buildCameraBasis(cam);
    const worldPt = transformPointLocalToWorld(entry.localPosition, entry.stack);
    const proj = projectWorldToScreen(
      worldPt,
      cam,
      basis,
      engine.store.size.width,
      engine.store.size.height
    );
    domRef.current.style.left = `${proj.sx.toFixed(1)}px`;
    domRef.current.style.top = `${proj.sy.toFixed(1)}px`;

    engine.htmlNodes.add(entry);
    return () => {
      engine.htmlNodes.delete(entry);
    };
  }, [engine]);

  return React.createElement(
    'div',
    {
      ref: domRef,
      className: 'drei-html-anchor',
      style: {
        position: 'absolute',
        transform: props.center ? 'translate(-50%, -50%)' : 'none',
        pointerEvents: 'auto',
      },
    },
    props.children
  );
}

Html.__isDreiHtml = true;

function Float(props) {
  return React.createElement(React.Fragment, null, props.children);
}

module.exports = {
  Html,
  Float,
};
