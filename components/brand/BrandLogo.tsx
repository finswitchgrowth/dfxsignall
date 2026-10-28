import Image from "next/image";
import { cn } from "@/lib/utils";

/** Official logo artwork, framed responsively without stretching or redrawing it. */
const SRC = "/brand/dfxsignall-logo.png";
const SIZE = 1254;

const FRAMES = {
  full: { x: 0, y: 0, w: 1254, h: 1254, fx: 6, fy: 6 },
  mark: { x: 200, y: 50, w: 900, h: 700, fx: 14, fy: 14, fyB: 6 },
  wordmark: { x: 62, y: 718, w: 1146, h: 214, fx: 1.5, fy: 12 },
  lockup: { x: 0, y: 60, w: 1254, h: 980, fx: 7, fy: 9 },
} as const;

function featherMask(fx: number, fy: number, fyB = fy) {
  if (!fx && !fy) return undefined;
  const h = `linear-gradient(to right, transparent, rgb(0 0 0 / 0.6) ${fx * 0.55}%, #000 ${fx}%, #000 ${100 - fx}%, rgb(0 0 0 / 0.6) ${100 - fx * 0.55}%, transparent)`;
  const v = `linear-gradient(to bottom, transparent, rgb(0 0 0 / 0.6) ${fy * 0.55}%, #000 ${fy}%, #000 ${100 - fyB}%, rgb(0 0 0 / 0.6) ${100 - fyB * 0.55}%, transparent)`;
  const r = "radial-gradient(ellipse 85% 85% at 50% 50%, #000 65%, transparent 100%)";
  return `${h}, ${v}, ${r}`;
}

export type LogoVariant = keyof typeof FRAMES;

type Props = {
  variant?: LogoVariant;
  width: number;
  className?: string;
  priority?: boolean;
  blend?: boolean;
  alt?: string;
};

export function BrandLogo({ variant = "lockup", width, className, priority, blend = true, alt = "DFXSIGNALL" }: Props) {
  const f = FRAMES[variant];
  const mask = featherMask(f.fx, f.fy, "fyB" in f ? f.fyB : f.fy);
  const imgPx = Math.round((SIZE / f.w) * width);
  return (
    <span
      className={cn("relative inline-block min-w-0 shrink-0 overflow-hidden align-middle", className)}
      style={{
        width: `min(${width}px, 100%)`,
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
        sizes={`(max-width: 420px) 40vw, ${Math.min(imgPx, SIZE)}px`}
        draggable={false}
        style={{
          position: "absolute",
          display: "block",
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
