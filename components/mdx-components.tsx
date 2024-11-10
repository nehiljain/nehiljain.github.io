/* eslint-disable no-unused-vars */
import { cn } from '@/lib/utils';
import Image from 'next/image';
import * as runtime from 'react/jsx-runtime';
import { Callout } from './callout';
import { YouTube } from '@/components/youtube';

const useMDXComponent = (code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
};

const components = {
  Image,
  Callout,
  YouTube: YouTube
};

interface MdxProps {
  code: string;
}

export function MDXContent({ code }: MdxProps) {
  const Component = useMDXComponent(code);
  return <Component components={components} />;
}
