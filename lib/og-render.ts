import { promises as fs } from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';
import { renderToStaticMarkup } from 'react-dom/server';
import * as React from 'react';
import { OgCard, type OgCardProps } from './og-card';

const FONT_PATH = path.resolve(
  process.cwd(),
  'assets/fonts/Inter-Bold.ttf'
);

let fontDataCache: Buffer | null = null;

async function loadFont(): Promise<Buffer> {
  if (fontDataCache) return fontDataCache;
  fontDataCache = await fs.readFile(FONT_PATH);
  return fontDataCache;
}

export async function renderOgPng(props: OgCardProps): Promise<Buffer> {
  const fontData = await loadFont();
  // satori-html parses an HTML/JSX string with `tw=` attributes and produces
  // the VDOM satori expects. We render the React component to static markup
  // first, then hand the resulting string to satori-html.
  const markup = renderToStaticMarkup(React.createElement(OgCard, props));
  // satori-html's html() returns a VNode shaped exactly like satori's
  // expected input, but the types don't align with satori's React-flavored
  // signature. Cast through unknown to satisfy the compiler.
  const vdom = html(markup) as unknown as React.ReactElement;
  const svg = await satori(vdom, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: fontData, style: 'normal', weight: 700 }
    ]
  });
  const png = new Resvg(svg, { background: 'white' }).render().asPng();
  return Buffer.from(png);
}
