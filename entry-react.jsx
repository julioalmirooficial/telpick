import React, { useRef, useEffect } from 'react';
import Telpick from './src/telpick.js';
import './src/telpick.css';

export function TelpickReact({ code, onChange, styleOverrides, baseFlagUrl = '' }) {
  const ref = useRef();
  useEffect(() => {
    if (!ref.current) return;
    const telpickInstance = new Telpick({ code, onChange, styleOverrides, baseFlagUrl });
    telpickInstance.init(ref.current);
    return () => telpickInstance.destroy();
  }, [code, onChange, styleOverrides, baseFlagUrl]);
  return <div ref={ref}></div>;
}
