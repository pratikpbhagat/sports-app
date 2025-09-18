
type PickleballLoaderProps = {
    size?: number | string; // px number or CSS size (e.g. "48px", "3rem")
    color?: string; // ball fill color (default: pickleball yellow)
    speed?: number; // rotation speed in seconds
    className?: string;
    ariaLabel?: string;
};

export default function PickleballLoader({
    size = 56,
    color = "#FDE74C",
    speed = 1.2,
    className,
    ariaLabel = "Loading",
}: PickleballLoaderProps) {
    // Generate a few rings of holes programmatically
    const holes: { cx: number; cy: number; r: number }[] = [];

    // outer ring (12 holes)
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const r = 14; // distance from center (in viewBox units)
        holes.push({
            cx: 32 + Math.cos(angle) * r,
            cy: 32 + Math.sin(angle) * r,
            r: 1.6,
        });
    }

    // inner ring (6 holes)
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + 0.26;
        const r = 8;
        holes.push({
            cx: 32 + Math.cos(angle) * r,
            cy: 32 + Math.sin(angle) * r,
            r: 1.6,
        });
    }

    // a couple of central holes
    holes.push({ cx: 32, cy: 32 - 4, r: 1.6 });
    holes.push({ cx: 32, cy: 32 + 4, r: 1.6 });

    const sizeStyle =
        typeof size === "number" ? `${size}px` : String(size ?? "56px");

    return (
        <div
            role="status"
            aria-label={ariaLabel}
            className={className}
            style={{
                display: "inline-block",
                width: sizeStyle,
                height: sizeStyle,
                lineHeight: 0,
                // pass speed and size into CSS custom props
                // @ts-ignore - customProperties
                ["--pickle-speed" as any]: `${speed}s`,
            }}
        >
            {/* Scoped CSS (keeps everything self-contained) */}
            <style>
                {`
          .pickle-svg {
            width: 100%;
            height: 100%;
            display: block;
            transform-origin: 50% 50%;
            animation: pickle-spin var(--pickle-speed) linear infinite, pickle-pulse calc(var(--pickle-speed) * 1.6) ease-in-out infinite;
          }

          @keyframes pickle-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes pickle-pulse {
            0% { transform: scale(1); }
            50% { transform: scale(0.985); }
            100% { transform: scale(1); }
          }

          /* subtle inner stroke for depth */
          .pickle-stroke {
            opacity: 0.07;
          }

          /* the holes - slightly darker than background to suggest depth */
          .pickle-hole {
            fill: rgba(0,0,0,0.18);
            mix-blend-mode: multiply;
          }

          /* accessible visually-hidden text */
          .sr-only {
            position: absolute !important;
            height: 1px; width: 1px;
            overflow: hidden;
            clip: rect(1px, 1px, 1px, 1px);
            white-space: nowrap;
          }
        `}
            </style>

            <svg
                className="pickle-svg"
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="false"
                role="img"
            >
                {/* outer ball */}
                <defs>
                    <radialGradient id="pb-grad" cx="30%" cy="25%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                        <stop offset="40%" stopColor={color} stopOpacity="1" />
                        <stop offset="100%" stopColor={color} stopOpacity="1" />
                    </radialGradient>
                </defs>

                <circle cx="32" cy="32" r="28" fill="url(#pb-grad)" stroke="#000000" strokeOpacity="0.06" className="pickle-stroke" />

                {/* seam arcs (subtle) */}
                <path d="M10 22 C26 28,38 18,54 26" fill="none" stroke="#000" strokeOpacity="0.04" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M12 44 C28 38,40 48,52 38" fill="none" stroke="#000" strokeOpacity="0.04" strokeWidth="1.4" strokeLinecap="round" />

                {/* holes */}
                {holes.map((h, i) => (
                    <circle key={i} cx={h.cx} cy={h.cy} r={h.r} className="pickle-hole" />
                ))}

                {/* subtle drop shadow within viewBox (gives depth) */}
                <ellipse cx="34" cy="46" rx="12" ry="3.4" fill="#000" opacity="0.06" />
            </svg>

            <span className="sr-only">{ariaLabel}…</span>
        </div>
    );
}
