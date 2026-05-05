/* eslint-disable no-unused-vars */
import { cn } from '@/lib/utils';
import Image from 'next/image';
import * as runtime from 'react/jsx-runtime';
import { Callout } from './callout';
import { YouTube } from '@/components/youtube';
import { Tweet } from 'react-tweet';
import { Quote } from './quote';
import { Screenshot } from './screenshot';
import { VideoClip } from './video-clip';

const useMDXComponent = (code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
};

const components = {
  Image,
  Callout,
  YouTube,
  Quote,
  Screenshot,
  VideoClip,
  Tweet: (props: any) => (
    <div className="flex justify-center my-4 tweet-wrapper">
      <Tweet {...props} />
    </div>
  )
};

interface MdxProps {
  code: string;
}

export function MDXContent({ code }: MdxProps) {
  const Component = useMDXComponent(code);
  return <Component components={components} />;
}
