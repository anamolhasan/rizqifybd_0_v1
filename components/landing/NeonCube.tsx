
"use client";

import type { CSSProperties } from "react";
import {
  Wifi,
  MessageSquareText,
  Wallet,
  PhoneCall,
  TrendingUp,
  Package,
} from "lucide-react";

const faces = [
  { label: "Internet", icon: Wifi, color: "var(--cy)", transform: "rotateY(0deg) translateZ(var(--half))" },
  { label: "SMS Pack", icon: MessageSquareText, color: "var(--mg)", transform: "rotateY(180deg) translateZ(var(--half))" },
  { label: "Wallet", icon: Wallet, color: "var(--vi)", transform: "rotateY(90deg) translateZ(var(--half))" },
  { label: "Minutes", icon: PhoneCall, color: "var(--mi)", transform: "rotateY(-90deg) translateZ(var(--half))" },
  { label: "Income", icon: TrendingUp, color: "var(--cy)", transform: "rotateX(90deg) translateZ(var(--half))" },
  { label: "Products", icon: Package, color: "var(--mg)", transform: "rotateX(-90deg) translateZ(var(--half))" },
];

export function NeonCube({ size = 170 }: { size?: number }) {
  return (
    <div
      aria-hidden="true"
      style={
        {
          "--s": `${size}px`,
          "--half": `${size / 2}px`,
        } as CSSProperties
      }
      className="relative isolate aspect-square w-(--s) perspective-[1000px]"
    >
      {/* Ambient glow */}
      <div className="absolute inset-[12%] -z-10 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative size-full transform-3d">
        {/* Animated core */}
        <div className="cube-core absolute inset-[28%] rounded-full bg-[radial-gradient(circle,var(--mg),var(--cy)_45%,transparent_72%)] opacity-70 blur-xl" />

        {/* Rotating 3D cube */}
        <div className="cube-rotation absolute inset-0 transform-3d motion-reduce:animate-none">
          {faces.map(({ label, icon: Icon, color, transform }) => (
            <div
              key={label}
              style={{
                transform,
                borderColor: `color-mix(in srgb, ${color} 70%, transparent)`,
                background: `color-mix(in srgb, var(--background) 88%, ${color} 12%)`,
                boxShadow: `inset 0 0 22px color-mix(in srgb, ${color} 12%, transparent), 0 0 18px color-mix(in srgb, ${color} 10%, transparent)`,
              }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border text-foreground backface-hidden"
            >
              <span
                style={{
                  color,
                  borderColor: `color-mix(in srgb, ${color} 35%, transparent)`,
                  background: `color-mix(in srgb, ${color} 9%, transparent)`,
                }}
                className="grid size-11 place-items-center rounded-xl border"
              >
                <Icon size={size * 0.17} strokeWidth={1.7} />
              </span>

              <span className="text-center text-xs font-bold tracking-wide">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}