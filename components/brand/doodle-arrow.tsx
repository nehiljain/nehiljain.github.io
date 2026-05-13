type Props = { color: string; width?: number; height?: number; style?: React.CSSProperties };
export function DoodleArrow({ color, width = 90, height = 50, style }: Props) {
  return (
    <svg width={width} height={height} viewBox="0 0 90 50" style={style}>
      <defs>
        <filter id="rough-arrow">
          <feTurbulence baseFrequency="0.04" numOctaves={2} seed={3} />
          <feDisplacementMap in="SourceGraphic" scale={1.2} />
        </filter>
      </defs>
      <g filter="url(#rough-arrow)" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round">
        <path d="M5 38 Q 30 5, 78 18" />
        <path d="M68 10 L 80 18 L 72 26" />
      </g>
    </svg>
  );
}
