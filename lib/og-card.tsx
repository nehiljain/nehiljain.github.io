import * as React from 'react';

declare module 'react' {
  interface HTMLAttributes<T> {
    tw?: string;
  }
  interface SVGAttributes<T> {
    tw?: string;
  }
}

export interface OgCardProps {
  title: string;
  footerUrl: string;
  githubUrl: string;
}

export function OgCard({ title, footerUrl, githubUrl }: OgCardProps) {
  const heading = title.length > 140 ? `${title.substring(0, 140)}...` : title;
  return (
    <div tw="flex relative flex-col p-12 w-full h-full items-start text-black bg-white">
      <div tw="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 11a9 9 0 0 1 9 9" />
          <path d="M4 4a16 16 0 0 1 16 16" />
          <circle cx="5" cy="19" r="1" />
        </svg>
        <p tw="ml-2 font-bold text-2xl">Nehil Jain</p>
      </div>
      <div tw="flex flex-col flex-1 py-10">
        <div tw="flex text-xl uppercase font-bold tracking-tight">POST</div>
        <div tw="flex text-[80px] font-bold text-[50px]">{heading}</div>
      </div>
      <div tw="flex items-center w-full justify-between">
        <div tw="flex text-xl">{footerUrl}</div>
        <div tw="flex items-center text-xl">
          <div tw="flex ml-2">{githubUrl}</div>
        </div>
      </div>
    </div>
  );
}
