import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export type SectionBackdropVariant =
  | "amber"
  | "dune"
  | "arch"
  | "mesh"
  | "ribbon"
  | "drift"
  | "tide"
  | "line"
  | "mosaic"
  | "loom"
  | "stone"
  | "orbit"
  | "sunset"
  | "canvas";

export type SectionBackdropTone = "light" | "dark";

const tonePalette = {
  light: {
    line: "rgba(77, 45, 36, 0.18)",
    primary: "rgba(201, 166, 106, 0.30)",
    accent: "rgba(77, 45, 36, 0.10)",
    soft: "rgba(247, 241, 230, 0.72)",
  },
  dark: {
    line: "rgba(242, 237, 228, 0.18)",
    primary: "rgba(201, 166, 106, 0.32)",
    accent: "rgba(255, 255, 255, 0.10)",
    soft: "rgba(27, 29, 26, 0.72)",
  },
} as const;

function renderBackdrop(
  variant: SectionBackdropVariant,
  tone: SectionBackdropTone,
) {
  const palette = tonePalette[tone];

  if (variant === "amber") {
    return (
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <defs>
          <radialGradient id="amber-glow" cx="60%" cy="30%" r="65%">
            <stop offset="0%" stopColor={palette.primary} stopOpacity="1" />
            <stop offset="100%" stopColor={palette.primary} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="620" cy="140" r="240" fill="url(#amber-glow)" />
        <circle cx="190" cy="480" r="180" fill={palette.accent} />
        <path d="M-40 430C120 340 220 520 340 450S610 330 840 440V620H-40Z" fill={palette.soft} opacity="0.18" />
      </svg>
    );
  }

  if (variant === "dune") {
    return (
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <path d="M0 450C150 390 250 520 390 470S620 340 800 430V600H0Z" fill={palette.primary} opacity="0.22" />
        <path d="M0 520C180 470 290 600 450 520S660 440 800 500V600H0Z" fill={palette.accent} opacity="0.36" />
        <path d="M120 170C200 120 240 230 340 210S520 110 670 170" fill="none" stroke={palette.line} strokeWidth="1.5" />
        <path d="M60 250C170 210 240 320 360 280S560 200 740 260" fill="none" stroke={palette.line} strokeWidth="1.2" />
      </svg>
    );
  }

  if (variant === "arch") {
    return (
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <path d="M-20 520C120 430 160 300 280 260S540 200 820 310" fill="none" stroke={palette.primary} strokeWidth="1.8" />
        <path d="M-30 560C140 470 180 360 310 320S560 250 840 350" fill="none" stroke={palette.line} strokeWidth="1.2" />
        <path d="M180 140C220 210 260 250 310 260C350 270 370 210 420 170C470 130 570 120 620 170" fill="none" stroke={palette.line} strokeWidth="1.2" />
        <circle cx="610" cy="170" r="5" fill={palette.primary} />
      </svg>
    );
  }

  if (variant === "mesh") {
    const dots: ReactNode[] = [];
    for (let row = 0; row < 7; row += 1) {
      for (let col = 0; col < 11; col += 1) {
        const x = 40 + col * 70;
        const y = 40 + row * 76;
        const distance = Math.hypot(col - 5, row - 3);
        dots.push(
          <circle
            key={`${row}-${col}`}
            cx={x}
            cy={y}
            r="2.2"
            fill={palette.line}
            opacity={Math.max(0.18, 1 - distance / 9)}
          />,
        );
      }
    }

    return (
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        {dots}
      </svg>
    );
  }

  if (variant === "ribbon") {
    return (
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <path d="M0 230L170 150L340 220L500 150L680 230L800 180V600H0Z" fill={palette.primary} opacity="0.22" />
        <path d="M0 310L200 250L330 330L540 240L800 330V600H0Z" fill={palette.accent} opacity="0.34" />
        <path d="M0 405L180 360L360 420L540 350L800 420V600H0Z" fill={palette.soft} opacity="0.22" />
      </svg>
    );
  }

  if (variant === "drift") {
    const lines = Array.from({ length: 7 }, (_, index) => {
      const y = 70 + index * 78;
      return (
        <path
          key={y}
          d={`M-40 ${y}C160 ${y - 60} 250 ${y + 90} 400 ${y}S650 ${y - 90} 840 ${y}`}
          fill="none"
          stroke={index % 2 === 0 ? palette.line : palette.primary}
          strokeWidth="1.4"
        />
      );
    });

    return (
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        {lines}
      </svg>
    );
  }

  if (variant === "tide") {
    return (
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <path d="M0 260C120 210 180 330 280 300S470 200 610 250S720 290 800 250V600H0Z" fill={palette.primary} opacity="0.22" />
        <path d="M0 340C140 290 220 420 340 390S520 300 700 350S760 380 800 360V600H0Z" fill={palette.accent} opacity="0.28" />
      </svg>
    );
  }

  if (variant === "line") {
    return (
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        {[80, 180, 280, 380, 480, 580, 680].map((x, index) => (
          <g key={x}>
            <line x1={x} y1="0" x2={x} y2="600" stroke={index % 2 === 0 ? palette.line : palette.primary} strokeWidth="1" />
            <line x1={x - 18} y1="80" x2={x + 18} y2="80" stroke={palette.line} strokeWidth="1" />
            <line x1={x - 18} y1="520" x2={x + 18} y2="520" stroke={palette.line} strokeWidth="1" />
          </g>
        ))}
      </svg>
    );
  }

  if (variant === "mosaic") {
    const tiles: ReactNode[] = [];
    const tileSize = 120;

    for (let row = 0; row < 5; row += 1) {
      for (let col = 0; col < 7; col += 1) {
        const x = 30 + col * tileSize;
        const y = 40 + row * tileSize;
        const isAccent = (row + col) % 2 === 0;

        tiles.push(
          <rect
            key={`${row}-${col}`}
            x={x}
            y={y}
            width="90"
            height="90"
            rx="18"
            fill={isAccent ? palette.primary : "transparent"}
            stroke={palette.line}
            strokeWidth="1"
            opacity={isAccent ? "0.22" : "0.12"}
          />,
        );
      }
    }

    return (
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        {tiles}
      </svg>
    );
  }

  if (variant === "loom") {
    const strands: ReactNode[] = [];

    for (let index = 0; index < 8; index += 1) {
      const y = 40 + index * 70;
      strands.push(
        <path
          key={`h-${index}`}
          d={`M-40 ${y}C160 ${y - 80} 260 ${y + 90} 420 ${y}S700 ${y - 100} 840 ${y}`}
          fill="none"
          stroke={index % 2 === 0 ? palette.line : palette.primary}
          strokeWidth="1.2"
        />,
      );
    }

    for (let index = 0; index < 7; index += 1) {
      const x = 80 + index * 110;
      strands.push(
        <path
          key={`v-${index}`}
          d={`M${x} -40C${x - 80} 140 ${x + 80} 260 ${x} 430S${x - 80} 700 ${x} 640`}
          fill="none"
          stroke={palette.accent}
          strokeWidth="1"
          opacity="0.7"
        />,
      );
    }

    return (
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        {strands}
      </svg>
    );
  }

  if (variant === "stone") {
    return (
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <rect x="460" y="90" width="240" height="330" rx="26" fill="none" stroke={palette.line} strokeWidth="1.2" transform="rotate(-7 460 90)" />
        <rect x="500" y="120" width="240" height="330" rx="26" fill="none" stroke={palette.primary} strokeWidth="1.5" transform="rotate(6 500 120)" />
        <rect x="540" y="160" width="240" height="330" rx="26" fill="none" stroke={palette.accent} strokeWidth="1.1" transform="rotate(14 540 160)" />
      </svg>
    );
  }

  if (variant === "orbit") {
    return (
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <circle cx="650" cy="260" r="160" fill="none" stroke={palette.line} strokeWidth="1" />
        <circle cx="650" cy="260" r="110" fill="none" stroke={palette.primary} strokeWidth="1.5" />
        <circle cx="650" cy="260" r="55" fill="none" stroke={palette.accent} strokeWidth="1.4" />
        {Array.from({ length: 12 }, (_, index) => {
          const angle = (index / 12) * Math.PI * 2;
          const x1 = 650 + Math.cos(angle) * 160;
          const y1 = 260 + Math.sin(angle) * 160;
          const x2 = 650 + Math.cos(angle) * 178;
          const y2 = 260 + Math.sin(angle) * 178;
          return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke={palette.line} strokeWidth="1" />;
        })}
        <circle cx="650" cy="260" r="4" fill={palette.primary} />
      </svg>
    );
  }

  if (variant === "sunset") {
    return (
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <defs>
          <linearGradient id="sunset-fade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={palette.primary} stopOpacity="0.72" />
            <stop offset="100%" stopColor={palette.primary} stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle cx="610" cy="160" r="170" fill="url(#sunset-fade)" />
        <path d="M0 430C140 360 220 500 350 470S600 330 800 430V600H0Z" fill={palette.accent} opacity="0.3" />
        <path d="M40 210C180 120 230 250 360 230S580 130 760 200" fill="none" stroke={palette.line} strokeWidth="1.6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <path d="M0 380C120 260 220 450 360 400S610 220 800 350V600H0Z" fill={palette.primary} opacity="0.2" />
      <path d="M0 470C160 430 260 550 420 500S650 420 800 490V600H0Z" fill={palette.accent} opacity="0.32" />
      <path d="M120 150C250 100 340 220 470 180S650 120 740 180" fill="none" stroke={palette.line} strokeWidth="1.4" />
    </svg>
  );
}

export function SectionBackdrop({
  variant = "amber",
  tone = "light",
  className,
}: {
  variant?: SectionBackdropVariant;
  tone?: SectionBackdropTone;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div className="absolute inset-0 opacity-100">{renderBackdrop(variant, tone)}</div>
    </div>
  );
}

export default SectionBackdrop;
