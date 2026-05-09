import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import * as React from 'react';
import { OgCard } from '@/lib/og-card';

describe('OgCard', () => {
  it('renders the title in markup', () => {
    const markup = renderToStaticMarkup(
      React.createElement(OgCard, {
        title: 'Distributed Systems 101',
        footerUrl: 'https://nehiljain.com',
        githubUrl: 'https://github.com/nehiljain'
      })
    );
    expect(markup).toContain('Distributed Systems 101');
    expect(markup).toContain('https://nehiljain.com');
    expect(markup).toContain('https://github.com/nehiljain');
  });

  it('truncates titles longer than 140 chars', () => {
    const long = 'a'.repeat(200);
    const markup = renderToStaticMarkup(
      React.createElement(OgCard, {
        title: long,
        footerUrl: 'x',
        githubUrl: 'x'
      })
    );
    expect(markup).toContain('...');
    expect(markup).not.toContain('a'.repeat(141));
  });
});
