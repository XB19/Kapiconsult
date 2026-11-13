import { useEffect } from 'react';

// Exécute le code d'un attribut HTML inline (onclick="...", onmouseover="...")
// avec `this` = l'élément et `event` = l'événement, exactement comme le site d'origine.
const cache = new Map();
export function inline(code) {
  return function handler(e) {
    let fn = cache.get(code);
    if (!fn) { fn = new Function('event', code); cache.set(code, fn); }
    return fn.call(e.currentTarget, e);
  };
}

// Exécute les <script> d'origine d'une page après son rendu (animations, modales…)
export function useLegacyScripts(scripts) {
  useEffect(() => {
    const nodes = scripts.map((code) => {
      const s = document.createElement('script');
      s.text = code;
      document.body.appendChild(s);
      return s;
    });
    return () => {
      nodes.forEach((s) => s.remove());
      document.body.style.overflow = '';
    };
  }, [scripts]);
}
