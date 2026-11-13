// Formats de date et troncatures identiques au site d'origine (Laravel / Carbon)
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const parts = (iso) => {
  const [y, m, d] = String(iso).slice(0, 10).split('-');
  return { y, m, d };
};

// "12 Mar 2026"
export const dateShort = (iso) => {
  if (!iso) return '';
  const { y, m, d } = parts(iso);
  return `${d} ${MONTHS[Number(m) - 1]} ${y}`;
};

// "12/03/2026"
export const dateFr = (iso) => {
  if (!iso) return '';
  const { y, m, d } = parts(iso);
  return `${d}/${m}/${y}`;
};

// Équivalent de Str::limit()
export const limit = (text, n) => {
  const s = String(text || '');
  return [...s].length <= n ? s : `${[...s].slice(0, n).join('').trimEnd()}...`;
};
