// Raw color values for places CSS vars can't reach (SVG fill/stroke, dynamic JS).
// Keep in sync with app/globals.css.

export const NJ_MARK_INK = '#11111b'; // near-black "nj" letters
export const NJ_PEACH = '#fe640b'; // canonical peach (latte)
export const NJ_PEACH_DARK = '#f5a97f'; // macchiato peach

export const LATTE = {
  base: '#ece9e2',
  mantle: '#e3e0d8',
  crust: '#d8d4cb',
  text: '#4c4f69',
  sub: '#6c6f85',
  mute: '#9ca0b0',
  peach: '#fe640b',
  yellow: '#df8e1d',
  green: '#40a02b',
  blue: '#1e66f5',
  mauve: '#8839ef',
  red: '#d20f39',
  teal: '#179299'
} as const;

export const MACCHIATO = {
  base: '#24273a',
  mantle: '#1e2030',
  crust: '#181926',
  text: '#cad3f5',
  sub: '#a5adcb',
  mute: '#8087a2',
  peach: '#f5a97f',
  yellow: '#eed49f',
  green: '#a6da95',
  blue: '#8aadf4',
  mauve: '#c6a0f6',
  red: '#ed8796',
  teal: '#8bd5ca'
} as const;
