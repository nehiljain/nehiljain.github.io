type Props = {
  size?: number;
  src: string;
  label?: string;
  sub?: string;
};

export function ProfilePortrait({ size = 280, src, label, sub }: Props) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div
        role="img"
        aria-label="Nehil Jain"
        className="absolute left-0 top-0 rounded-full border-4 border-paper bg-cover shadow-[5px_6px_0_rgba(0,0,0,0.13)] dark:shadow-[5px_6px_0_rgba(0,0,0,0.33)]"
        style={{
          width: size,
          height: size,
          backgroundImage: `url(${src})`,
          backgroundPosition: 'center 28%'
        }}
      />
      {label && (
        <div
          className="absolute rounded-full border border-dashed bg-white px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] shadow-[2px_2px_0_rgba(0,0,0,0.08)]"
          style={{
            top: 12,
            right: -22,
            transform: 'rotate(6deg)',
            borderColor: '#4c4f69',
            color: '#4c4f69'
          }}
        >
          {label}
          {sub && (
            <div
              className="font-script text-[13px] normal-case tracking-normal opacity-75"
              style={{ marginTop: -2 }}
            >
              {sub}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
