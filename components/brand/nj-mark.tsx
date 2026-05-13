import { NJ_MARK_INK, NJ_PEACH } from '@/lib/design-tokens';

export { NJ_MARK_INK, NJ_PEACH };

export function NJMark({
  size = 48,
  accent = NJ_PEACH,
  tilt = 0,
  bg = null,
}: {
  size?: number;
  accent?: string;
  tilt?: number;
  bg?: string | null;
}) {
  const ratio = 1.18;
  const w = size * ratio;
  const h = size;
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ display: 'block', overflow: 'visible', transform: `rotate(${tilt}deg)` }}
    >
      {bg && <rect x="0" y="0" width={w} height={h} rx={size * 0.16} fill={bg} />}
      <ellipse
        cx={w * 0.5}
        cy={h * 0.58}
        rx={w * 0.42}
        ry={h * 0.34}
        fill={accent}
      />
      <text
        x={w * 0.5}
        y={h * 0.93}
        textAnchor="middle"
        fontFamily="var(--font-display), system-ui, sans-serif"
        fontSize={h * 1.05}
        fontWeight="400"
        fill={NJ_MARK_INK}
        letterSpacing={-h * 0.04}
      >
        nj
      </text>
    </svg>
  );
}

export function NJWordmark({
  size = 36,
  accent = NJ_PEACH,
  ink = '#4c4f69',
  uppercase = false,
}: {
  size?: number;
  accent?: string;
  ink?: string;
  uppercase?: boolean;
}) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-display), system-ui, sans-serif',
        fontSize: size,
        lineHeight: 0.9,
        letterSpacing: -size * 0.02,
        color: ink,
        textTransform: uppercase ? 'uppercase' : 'lowercase',
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: size * 0.18,
      }}
    >
      <span>nehil</span>
      <span style={{ position: 'relative' }}>
        <span>jain</span>
        <span
          style={{
            position: 'absolute',
            top: -size * 0.05,
            right: size * 0.78,
            width: size * 0.18,
            height: size * 0.18,
            borderRadius: '50%',
            background: accent,
            display: 'inline-block',
          }}
        />
      </span>
    </span>
  );
}

export function NJLockup({
  size = 32,
  accent = NJ_PEACH,
  ink = '#4c4f69',
  showWordmark = true,
}: {
  size?: number;
  accent?: string;
  ink?: string;
  showWordmark?: boolean;
}) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.42 }}>
      <NJMark size={size} accent={accent} />
      {showWordmark && (
        <span
          style={{
            fontFamily: 'var(--font-display), system-ui, sans-serif',
            fontSize: size * 0.78,
            lineHeight: 0.92,
            letterSpacing: -size * 0.012,
            color: ink,
          }}
        >
          nehil jain
        </span>
      )}
    </span>
  );
}

export function NJStamp({
  size = 220,
  accent = NJ_PEACH,
  ink = '#4c4f69',
  label = null,
  sub = null,
}: {
  size?: number;
  accent?: string;
  ink?: string;
  label?: string | null;
  sub?: string | null;
}) {
  const w = size * 1.05;
  const h = size;
  return (
    <div style={{ position: 'relative', width: w, height: h }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
        <ellipse cx={w * 0.5} cy={h * 0.58} rx={w * 0.46} ry={h * 0.34} fill={accent} />
        <text
          x={w * 0.5}
          y={h * 0.96}
          textAnchor="middle"
          fontFamily="var(--font-display), system-ui, sans-serif"
          fontSize={h * 1.08}
          fill={NJ_MARK_INK}
          letterSpacing={-h * 0.04}
        >
          nj
        </text>
      </svg>
      {label && (
        <div
          style={{
            position: 'absolute', top: 12, right: -8,
            transform: 'rotate(6deg)',
            background: '#fff', color: ink,
            borderRadius: 999, padding: '6px 12px',
            fontFamily: 'var(--font-mono), monospace', fontSize: 10,
            letterSpacing: 1.4, textTransform: 'uppercase',
            border: `1.5px dashed ${ink}`,
            fontWeight: 600,
          }}
        >
          {label}
          {sub && (
            <div
              style={{
                fontFamily: 'var(--font-script), cursive',
                fontSize: 13,
                letterSpacing: 0,
                textTransform: 'none',
                marginTop: -2,
                opacity: 0.75,
              }}
            >
              {sub}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
