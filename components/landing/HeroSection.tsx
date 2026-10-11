"use client";

import Link from "next/link";
import { useRef, type CSSProperties, type PointerEvent } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NeonCube } from "@/components/landing/NeonCube";

const modules = [
  {
    n: "১",
    t: "আপনার অ্যাকাউন্ট",
    d: "ব্যবহারকারীর তথ্য ও ব্যালান্স ম্যানেজ করুন।",
    c: "var(--cy)",
    z: 50,
    pos: "lg:left-0 lg:top-8",
  },
  {
    n: "২",
    t: "RizqifyBD API",
    d: "সহজ ইন্টিগ্রেশন, প্যানেল-বান্ধব ব্যবহার।",
    c: "var(--mg)",
    z: 140,
    pos: "lg:right-0 lg:top-0",
  },
  {
    n: "৩",
    t: "SIM কোম্পানি",
    d: "বিভিন্ন অপারেটরের সঙ্গে সিম সংযোগ।",
    c: "var(--vi)",
    z: 120,
    pos: "lg:bottom-5 lg:left-3",
  },
  {
    n: "৪",
    t: "আপনার অফার",
    d: "প্ল্যান তৈরি করে গ্রাহকদের সেরা অফার দিন।",
    c: "var(--mi)",
    z: 60,
    pos: "lg:bottom-14 lg:right-1",
  },
];

export default function HeroSection() {
  const scene = useRef<HTMLDivElement>(null);

  const tilt = (e: PointerEvent<HTMLDivElement>) => {
    const el = scene.current;
    if (
      !el ||
      window.innerWidth < 1024 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const r = e.currentTarget.getBoundingClientRect();
    el.style.setProperty(
      "--ry",
      `${((e.clientX - r.left) / r.width - 0.5) * 16}deg`,
    );
    el.style.setProperty(
      "--rx",
      `${-((e.clientY - r.top) / r.height - 0.5) * 12}deg`,
    );
  };

  const reset = () => {
    scene.current?.style.setProperty("--ry", "0deg");
    scene.current?.style.setProperty("--rx", "0deg");
  };

  return (
    <section className="relative isolate flex-1 overflow-hidden bg-slate-950 text-slate-100">
      <div
        aria-hidden
        className="hero-glow pointer-events-none absolute inset-0 -z-10"
      />
      <div
        aria-hidden
        className="neon-floor pointer-events-none absolute -inset-x-1/4 bottom-[-8%] -z-10 h-[46%]"
      />

      <div className="mx-auto grid min-h-[90vh] max-w-300 items-center gap-10 px-6 py-12 lg:grid-cols-2">
        <div>
          <Badge
            variant="outline"
            className="glow-cy mb-6 h-auto rounded-full border-neon-cy/50 px-4 py-1.5 text-sm font-semibold text-neon-cy"
          >
            সততায় ব্যবসার মূলধন
          </Badge>
          <h1 className="mb-6 font-heading text-4xl font-extrabold leading-[1.3] sm:text-5xl lg:text-[3.9rem]">
            RizqifyBD-তে আপনার পার্ট টাইম উপার্জন
            <span className="text-neon block">এখনই শুরু করুন।</span>
          </h1>
          <p className="mb-8 max-w-[34em] text-lg leading-[1.85] text-slate-400">
            আমাদের লক্ষ্য: দ্রুত এবং নির্ভরযোগ্য MB, মিনিট, SMS, utility bill ও
            ticket সেবা প্রদান করা। এখানে কোনো তৃতীয় পক্ষের API provider নেই —
            সবকিছুই আপনাদের খেদমতের জন্য নির্মিত।
          </p>
          <div className="flex flex-wrap gap-3.5">
            <Button
              asChild
              size="lg"
              className="glow-cy h-12 px-6 font-heading text-base font-extrabold"
            >
              <Link href="/sign-up">সাইন আপ করুন</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="glow-mg h-12 border-neon-mg bg-transparent px-6 font-heading text-base font-extrabold text-slate-100 hover:bg-white/5 hover:text-white"
            >
              <Link href="/login">লগ ইন করুন</Link>
            </Button>
          </div>
        </div>

        <div
          onPointerMove={tilt}
          onPointerLeave={reset}
          className="perspective-[1100px]"
          aria-label="RizqifyBD সেবাসমূহ"
        >
          <div
            ref={scene}
            className="scene grid gap-3 sm:grid-cols-2 lg:block"
          >
            <div className="flex justify-center py-4 sm:col-span-2 lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:py-0 transform-3d">
              <NeonCube size={170} />
            </div>
            {modules.map((m) => (
              <Card
                key={m.n}
                tabIndex={0}
                style={{ "--c": m.c, "--z": `${m.z}px` } as CSSProperties}
                className={`panel gap-0 rounded-2xl bg-slate-900/80 p-5 ring-0 lg:absolute lg:w-56 ${m.pos}`}
              >
                <span className="panel-num mb-2.5">{m.n}</span>
                <h3 className="mb-1.5 font-heading text-lg font-extrabold leading-snug text-white">
                  {m.t}
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">{m.d}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
