// Convertit un fragment HTML en JSX fidèle (styles inline -> objets, handlers inline -> inline())
const parse5 = require('parse5');

const ORIGIN = /https?:\/\/(www\.)?kapiconsult\.tg/g;
const ATTR_MAP = {
  class: 'className', for: 'htmlFor', tabindex: 'tabIndex', readonly: 'readOnly', maxlength: 'maxLength',
  minlength: 'minLength', colspan: 'colSpan', rowspan: 'rowSpan', enctype: 'encType', autocomplete: 'autoComplete',
  autoplay: 'autoPlay', allowfullscreen: 'allowFullScreen', frameborder: 'frameBorder', crossorigin: 'crossOrigin',
  srcset: 'srcSet', playsinline: 'playsInline', novalidate: 'noValidate', 'accept-charset': 'acceptCharset',
  'http-equiv': 'httpEquiv', referrerpolicy: 'referrerPolicy', datetime: 'dateTime', spellcheck: 'spellCheck',
  contenteditable: 'contentEditable', autofocus: 'autoFocus', formaction: 'formAction', cellpadding: 'cellPadding',
  cellspacing: 'cellSpacing', usemap: 'useMap', allow: 'allow', 'xlink:href': 'xlinkHref', 'xml:space': 'xmlSpace',
};
const BOOL = new Set(['disabled', 'required', 'checked', 'selected', 'multiple', 'autoplay', 'muted', 'loop', 'controls',
  'playsinline', 'allowfullscreen', 'readonly', 'novalidate', 'hidden', 'autofocus', 'open', 'defer', 'async']);
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const NO_WS = new Set(['select', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'colgroup', 'svg', 'g', 'defs', 'linearGradient', 'radialGradient', 'clipPath', 'mask', 'pattern', 'filter']);
const EVENTS = { onclick: 'onClick', onmouseover: 'onMouseOver', onmouseout: 'onMouseOut', onmouseenter: 'onMouseEnter',
  onmouseleave: 'onMouseLeave', onchange: 'onChange', oninput: 'onInput', onsubmit: 'onSubmit', onfocus: 'onFocus',
  onblur: 'onBlur', onkeyup: 'onKeyUp', onkeydown: 'onKeyDown', onload: 'onLoad', onerror: 'onError', ondblclick: 'onDoubleClick' };

const fixUrl = (s) => s.replace(ORIGIN, '').replace(/^$/, '/');
const q = (s) => JSON.stringify(s);

function camel(prop) {
  if (prop.startsWith('--')) return prop;
  let p = prop.toLowerCase();
  if (p.startsWith('-ms-')) p = p.slice(1);
  else if (p.startsWith('-')) p = p.slice(1).replace(/^./, (c) => c.toUpperCase());
  return p.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function splitDecl(css) {
  const out = []; let cur = ''; let depth = 0; let quote = null;
  for (const ch of css) {
    if (quote) { cur += ch; if (ch === quote) quote = null; continue; }
    if (ch === '"' || ch === "'") { quote = ch; cur += ch; continue; }
    if (ch === '(') depth++; if (ch === ')') depth--;
    if (ch === ';' && depth === 0) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out;
}

function styleObj(css) {
  const parts = [];
  for (const d of splitDecl(css)) {
    const i = d.indexOf(':'); if (i < 0) continue;
    const k = d.slice(0, i).trim(); const v = fixUrl(d.slice(i + 1).trim()); if (!k) continue;
    parts.push(`${q(camel(k))}: ${q(v)}`);
  }
  return `{{${parts.join(', ')}}}`;
}

function attrName(name, isSvg) {
  if (EVENTS[name]) return EVENTS[name];
  if (ATTR_MAP[name]) return ATTR_MAP[name];
  if (name.startsWith('data-') || name.startsWith('aria-')) return name;
  if (isSvg || name.includes('-')) return name.replace(/[-:]([a-z])/g, (_, c) => c.toUpperCase());
  return name;
}

function convertAttrs(node, ctx) {
  const tag = node.tagName; const isSvg = node.namespaceURI === 'http://www.w3.org/2000/svg';
  const res = [];
  for (const { name, value } of node.attrs) {
    if (name === 'style') { if (value.trim()) res.push(`style=${styleObj(value)}`); continue; }
    if (EVENTS[name]) { res.push(`${EVENTS[name]}={inline(${q(fixUrl(value))})}`); continue; }
    if (name === 'href' && /^javascript:/i.test(value)) {
      res.push(`href="#"`, `onClick={inline(${q(value.replace(/^javascript:/i, '') + ';event.preventDefault();')})}`); continue;
    }
    if (name === '_token' || (tag === 'input' && name === 'name' && value === '_token')) continue;
    let n = attrName(name, isSvg);
    if (tag === 'input' || tag === 'textarea') {
      if (name === 'value') n = 'defaultValue';
      if (name === 'checked') n = 'defaultChecked';
    }
    if (tag === 'option' && name === 'selected') { ctx.selected = true; continue; }
    if (BOOL.has(name) && (value === '' || value === name)) { res.push(`${n}={true}`); continue; }
    let v = value;
    if (['href', 'src', 'action', 'poster', 'srcset', 'data-src', 'data-bg'].includes(name)) v = fixUrl(v) || '/';
    res.push(`${n}={${q(v)}}`);
  }
  return res;
}

function text(t, pre) {
  if (pre) return `{${q(t)}}`;
  const norm = t.replace(/\s+/g, ' ');
  return `{${q(norm)}}`;
}

function convert(node, ctx = {}, indent = '') {
  if (node.nodeName === '#comment') return '';
  if (node.nodeName === '#text') {
    if (!node.value.trim()) {
      if (ctx.noWs) return '';
      return /\s/.test(node.value) ? '{" "}' : '';
    }
    return text(node.value, ctx.pre);
  }
  const tag = node.tagName;
  const kids = (node.tagName === 'template' ? node.content : node).childNodes || [];
  if (tag === 'script') {
    const code = kids.map((k) => k.value).join('');
    const type = (node.attrs.find((a) => a.name === 'type') || {}).value;
    if (!type || type === 'text/javascript') (ctx.scripts || []).push(code);
    return '';
  }
  if (tag === 'style') {
    const css = fixUrl(kids.map((k) => k.value).join('')).replace(ORIGIN, '');
    return `<style dangerouslySetInnerHTML={{__html: ${q(css)}}} />`;
  }
  if (tag === 'input' && node.attrs.some((a) => a.name === 'name' && a.value === '_token')) return '';
  const local = {};
  const attrs = convertAttrs(node, local);
  if (tag === 'select') {
    const sel = [];
    const walk = (n) => { (n.childNodes || []).forEach((c) => { if (c.tagName === 'option' && c.attrs.some((a) => a.name === 'selected')) sel.push(c); walk(c); }); };
    walk(node);
    if (sel.length) {
      const v = sel[0].attrs.find((a) => a.name === 'value');
      attrs.push(`defaultValue={${q(v ? v.value : sel[0].childNodes.map((c) => c.value || '').join(''))}}`);
    }
  }
  if (tag === 'textarea') {
    const val = kids.map((k) => k.value).join('');
    if (val) attrs.push(`defaultValue={${q(val)}}`);
    return `<textarea ${attrs.join(' ')} />`;
  }
  const open = `<${tag}${attrs.length ? ' ' + attrs.join(' ') : ''}`;
  if (VOID.has(tag)) return `${open} />`;
  const childCtx = { ...ctx, noWs: NO_WS.has(tag) || NO_WS.has(node.nodeName), pre: ctx.pre || tag === 'pre' };
  const inner = kids.map((k) => convert(k, childCtx, indent + '  ')).filter(Boolean);
  if (!inner.length) return `${open} />`;
  return `${open}>\n${indent}  ${inner.join(`\n${indent}  `)}\n${indent}</${tag}>`;
}

function htmlToJsx(html, scripts = []) {
  const frag = parse5.parseFragment(html);
  const ctx = { scripts };
  const parts = frag.childNodes.map((n) => convert(n, ctx, '      ')).filter((s) => s && s !== '{" "}');
  return parts.join('\n      ');
}

module.exports = { htmlToJsx, fixUrl };
