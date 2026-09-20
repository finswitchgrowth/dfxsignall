import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Official DFXSIGNALL logo.
 * ALWAYS renders the original supplied file (/public/brand/dfxsignall-logo.png, 1254×1254).
 * Variants are produced purely with CSS framing (overflow crop) — the artwork is never redrawn,
 * re-typed, recoloured or distorted. `mix-blend-mode: screen` lets the logo's black ground
 * disappear into the site's dark background.
 */
const SRC = "/brand/dfxsignall-logo.png";
const SIZE = 1254;

const FRAMES = {
  /** Whole square file */
  full: { x: 0, y: 0, w: 1254, h: 1254, fx: 6, fy: 6 },
  /** "D" emblem region (generous padding so feathering never touches the artwork) */
  mark: { x: 200, y: 50, w: 900, h: 700, fx: 14, fy: 14, fyB: 6 },
  /** DFXSIGNALL™ wordmark region */
  wordmark: { x: 62, y: 718, w: 1146, h: 214, fx: 1.5, fy: 12 },
  /** Emblem + wordmark + tagline */
  lockup: { x: 0, y: 60, w: 1254, h: 980, fx: 7, fy: 9 },
} as const;

/** Feathered edges so the logo's own ambient glow never shows a hard crop line. */
function featherMask(fx: number, fy: number, fyB = fy) {
  if (!fx && !fy) return undefined;
  const h = `linear-gradient(to right, transparent, rgb(0 0 0 / 0.6) ${fx * 0.55}%, #000 ${fx}%, #000 ${100 - fx}%, rgb(0 0 0 / 0.6) ${100 - fx * 0.55}%, transparent)`;
  const v = `linear-gradient(to bottom, transparent, rgb(0 0 0 / 0.6) ${fy * 0.55}%, #000 ${fy}%, #000 ${100 - fyB}%, rgb(0 0 0 / 0.6) ${100 - fyB * 0.55}%, transparent)`;
  // soften the corners, where the artwork's ambient glow is strongest
  const r = "radial-gradient(ellipse 85% 85% at 50% 50%, #000 65%, transparent 100%)";
  return `${h}, ${v}, ${r}`;
}

export type LogoVariant = keyof typeof FRAMES;

type Props = {
  variant?: LogoVariant;
  /** Rendered width in px (height follows the frame ratio) */
  width: number;
  className?: string;
  priority?: boolean;
  blend?: boolean;
  alt?: string;
};

export function BrandLogo({ variant = "lockup", width, className, priority, blend = true, alt = "DFXSIGNALL" }: Props) {
  const f = FRAMES[variant];
  const mask = featherMask(f.fx, f.fy, "fyB" in f ? f.fyB : f.fy);
  // Percent-based framing keeps the crop exact at any rendered size (responsive via max-width).
  const imgPx = Math.round((SIZE / f.w) * width);
  return (
    <span
      className={cn("relative inline-block shrink-0 overflow-hidden align-middle", className)}
      style={{
        width,
        maxWidth: "100%",
        aspectRatio: `${f.w} / ${f.h}`,
        mixBlendMode: blend ? "screen" : undefined,
        maskImage: mask,
        WebkitMaskImage: mask,
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
      role="img"
      aria-label={alt}
    >
      <Image
        src={SRC}
        alt=""
        aria-hidden
        width={SIZE}
        height={SIZE}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        sizes={`${Math.min(imgPx, SIZE)}px`}
        draggable={false}
        style={{
          position: "absolute",
          maxWidth: "none",
          width: `${(SIZE / f.w) * 100}%`,
          height: "auto",
          left: `${(-f.x / f.w) * 100}%`,
          top: `${(-f.y / f.h) * 100}%`,
        }}
      />
    </span>
  );
}
