import * as React from 'react';

type IconProps = {
  size?: number;
  stroke?: string;
  fill?: string;
  weight?: number;
  className?: string;
};

export function NJIcon({
  size = 24,
  stroke,
  fill,
  weight = 2.4,
  children
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={weight}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, color: 'currentColor' }}
    >
      <g stroke={stroke ?? 'currentColor'} fill="none">
        {React.Children.map(children, (c) => {
          if (!c || !React.isValidElement(c)) return c;
          const props = c.props as Record<string, unknown>;
          if (props['data-duo'] === 'fill') {
            return React.cloneElement(c, {
              fill: fill ?? 'currentColor',
              fillOpacity: (props.fillOpacity as number) ?? 0.22,
              stroke: 'none'
            } as React.SVGAttributes<SVGElement>);
          }
          return c;
        })}
      </g>
    </svg>
  );
}

export const Icon = {
  Home: (p: IconProps) => (
    <NJIcon {...p}>
      <path
        data-duo="fill"
        d="M4 11l8-6 8 6v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"
      />
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v9a1 1 0 0 0 1 1h3v-6h6v6h3a1 1 0 0 0 1-1v-9" />
    </NJIcon>
  ),
  Writing: (p: IconProps) => (
    <NJIcon {...p}>
      <path data-duo="fill" d="M5 5h10l4 4v10H5z" />
      <path d="M5 5h10l4 4v10H5z" />
      <path d="M15 5v4h4" />
      <path d="M8 13h7M8 17h5" />
    </NJIcon>
  ),
  Projects: (p: IconProps) => (
    <NJIcon {...p}>
      <circle data-duo="fill" cx="12" cy="12" r="8" />
      <path d="M9 9l-3 3 3 3" />
      <path d="M15 9l3 3-3 3" />
      <path d="M13.5 8.5l-3 7" />
    </NJIcon>
  ),
  CV: (p: IconProps) => (
    <NJIcon {...p}>
      <path data-duo="fill" d="M6 4h9l3 3v13H6z" />
      <path d="M6 4h9l3 3v13H6z" />
      <path d="M15 4v3h3" />
      <circle cx="12" cy="11.5" r="2" />
      <path d="M8.5 17c.6-1.7 2-2.5 3.5-2.5s2.9.8 3.5 2.5" />
    </NJIcon>
  ),
  Search: (p: IconProps) => (
    <NJIcon {...p}>
      <circle data-duo="fill" cx="11" cy="11" r="6.5" />
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4 4" />
    </NJIcon>
  ),
  Mail: (p: IconProps) => (
    <NJIcon {...p}>
      <rect data-duo="fill" x="3" y="5" width="18" height="14" rx="2" />
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
    </NJIcon>
  ),
  Github: (p: IconProps) => (
    <NJIcon {...p}>
      <path
        data-duo="fill"
        d="M12 3.5a8.5 8.5 0 0 0-2.7 16.6c.4.1.6-.2.6-.4v-1.6c-2.4.5-2.9-1.1-2.9-1.1-.4-1-1-1.3-1-1.3-.8-.6.1-.6.1-.6.9.1 1.4.9 1.4.9.8 1.4 2.2 1 2.7.8.1-.6.3-1 .6-1.2-1.9-.2-3.9-1-3.9-4.2 0-.9.3-1.7.9-2.3-.1-.2-.4-1.1.1-2.3 0 0 .7-.2 2.3.9.7-.2 1.4-.3 2.1-.3s1.4.1 2.1.3c1.6-1.1 2.3-.9 2.3-.9.5 1.2.2 2.1.1 2.3.6.6.9 1.4.9 2.3 0 3.3-2 4-3.9 4.2.3.3.6.8.6 1.6v2.4c0 .2.2.5.6.4A8.5 8.5 0 0 0 12 3.5z"
      />
      <path d="M12 3.5a8.5 8.5 0 0 0-2.7 16.6c.4.1.6-.2.6-.4v-1.6c-2.4.5-2.9-1.1-2.9-1.1-.4-1-1-1.3-1-1.3-.8-.6.1-.6.1-.6.9.1 1.4.9 1.4.9.8 1.4 2.2 1 2.7.8.1-.6.3-1 .6-1.2-1.9-.2-3.9-1-3.9-4.2 0-.9.3-1.7.9-2.3-.1-.2-.4-1.1.1-2.3 0 0 .7-.2 2.3.9.7-.2 1.4-.3 2.1-.3s1.4.1 2.1.3c1.6-1.1 2.3-.9 2.3-.9.5 1.2.2 2.1.1 2.3.6.6.9 1.4.9 2.3 0 3.3-2 4-3.9 4.2.3.3.6.8.6 1.6v2.4c0 .2.2.5.6.4A8.5 8.5 0 0 0 12 3.5z" />
    </NJIcon>
  ),
  LinkedIn: (p: IconProps) => (
    <NJIcon {...p}>
      <rect data-duo="fill" x="3.5" y="3.5" width="17" height="17" rx="2.5" />
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
      <path d="M8 10v7M8 7v.1M11.5 17v-7M11.5 13c0-2 1.5-3 3-3s2.5 1 2.5 3v4" />
    </NJIcon>
  ),
  Twitter: (p: IconProps) => (
    <NJIcon {...p}>
      <path
        data-duo="fill"
        d="M4 4l7 9-7 7h3l5.5-5.5L17 20h3l-7.5-9.5L19.5 4h-3l-5 5L8 4z"
      />
      <path d="M4 4l7 9-7 7h3l5.5-5.5L17 20h3l-7.5-9.5L19.5 4h-3l-5 5L8 4z" />
    </NJIcon>
  ),
  ArrowRight: (p: IconProps) => (
    <NJIcon {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </NJIcon>
  ),
  ArrowUpRight: (p: IconProps) => (
    <NJIcon {...p}>
      <path d="M7 17L17 7M9 7h8v8" />
    </NJIcon>
  ),
  Tag: (p: IconProps) => (
    <NJIcon {...p}>
      <path data-duo="fill" d="M3 12V4h8l10 10-8 8z" />
      <path d="M3 12V4h8l10 10-8 8z" />
      <circle cx="8" cy="8" r="1.5" />
    </NJIcon>
  ),
  Calendar: (p: IconProps) => (
    <NJIcon {...p}>
      <rect data-duo="fill" x="3" y="5" width="18" height="16" rx="2" />
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </NJIcon>
  ),
  Clock: (p: IconProps) => (
    <NJIcon {...p}>
      <circle data-duo="fill" cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3 2" />
    </NJIcon>
  ),
  Spark: (p: IconProps) => (
    <NJIcon {...p}>
      <path
        data-duo="fill"
        d="M12 3l1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8z"
      />
      <path d="M12 3l1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8z" />
    </NJIcon>
  ),
  Sun: (p: IconProps) => (
    <NJIcon {...p}>
      <circle data-duo="fill" cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
    </NJIcon>
  ),
  Moon: (p: IconProps) => (
    <NJIcon {...p}>
      <path data-duo="fill" d="M20 14a8 8 0 0 1-10-10 8 8 0 1 0 10 10z" />
      <path d="M20 14a8 8 0 0 1-10-10 8 8 0 1 0 10 10z" />
    </NJIcon>
  ),
  Code: (p: IconProps) => (
    <NJIcon {...p}>
      <rect data-duo="fill" x="3" y="4" width="18" height="16" rx="2" />
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 10l-2 2 2 2M15 10l2 2-2 2M13 9l-2 6" />
    </NJIcon>
  ),
  Stack: (p: IconProps) => (
    <NJIcon {...p}>
      <path data-duo="fill" d="M12 3l9 5-9 5-9-5z" />
      <path d="M12 3l9 5-9 5-9-5z" />
      <path d="M3 12l9 5 9-5M3 16l9 5 9-5" />
    </NJIcon>
  )
};
