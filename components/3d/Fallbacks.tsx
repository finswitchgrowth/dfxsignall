/**
 * Static CSS/SVG visuals used when WebGL is unavailable, fails, or is still loading.
 * Designed to look intentional on their own — not like a broken state.
 */
export function OrbFallback({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute left-1/2 top-1/2 aspect-square w-[min(80vw,560px)] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgb(31_216_255/0.35),rgb(43_107_255/0.18)_38%,rgb(3_6_13/0)_68%)] blur-[2px]" />
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full opacity-70">
          <defs>
            <linearGradient id="fb-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2b6bff" />
              <stop offset="55%" stopColor="#1fd8ff" />
              <stop offset="100%" stopColor="#34f08c" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="62" fill="none" stroke="url(#fb-g)" strokeOpacity="0.5" strokeWidth="0.5" />
          {[20, 40, 60].map((ry) => (
            <ellipse key={ry} cx="100" cy="100" rx="62" ry={ry} fill="none" stroke="#2b6bff" strokeOpacity="0.18" strokeWidth="0.4" />
          ))}
          {[18, 36, 54].map((rx) => (
            <ellipse key={rx} cx="100" cy="100" rx={rx} ry="62" fill="none" stroke="#2b6bff" strokeOpacity="0.18" strokeWidth="0.4" />
          ))}
          <ellipse cx="100" cy="100" rx="92" ry="30" fill="none" stroke="#1fd8ff" strokeOpacity="0.45" strokeWidth="0.6" transform="rotate(-18 100 100)" strokeDasharray="160 60" />
          {[
            [62, 78],
            [128, 64],
            [140, 118],
            [82, 138],
            [104, 96],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.6" fill={i % 2 ? "#34f08c" : "#1fd8ff"} />
          ))}
        </svg>
      </div>
    </div>
  );
}

export function GridFallback() {
  return <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" aria-hidden />;
}
