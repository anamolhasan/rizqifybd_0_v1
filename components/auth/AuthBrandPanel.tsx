import Link from "next/link";
import { Check, ShieldCheck, Sparkles, Star, TrendingUp } from "lucide-react";

import { BrandLogo } from "@/components/auth/BrandLogo";

const FEATURES = [
  "তাৎক্ষণিক MB, মিনিট ও SMS রিচার্জ",
  "এক ড্যাশবোর্ডে সব সেবা ও ব্যালান্স",
  "নিরাপদ ও এনক্রিপ্টেড লেনদেন",
];

const STATS = [
  { value: "24/7", label: "সাপোর্ট" },
  { value: "99.9%", label: "আপটাইম" },
  { value: "10K+", label: "ব্যবহারকারী" },
];

export function AuthBrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-slate-950 lg:flex lg:w-1/2 xl:w-[55%]">
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:48px_48px]"
      />
      <div
        aria-hidden
        className="absolute -top-40 -left-24 size-[28rem] rounded-full bg-sky-500/25 blur-[120px]"
      />
      <div
        aria-hidden
        className="absolute -right-32 bottom-0 size-[26rem] rounded-full bg-emerald-500/15 blur-[120px]"
      />
      <div
        aria-hidden
        className="absolute top-1/2 left-1/3 size-72 rounded-full bg-indigo-500/20 blur-[120px]"
      />

      <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          <BrandLogo tone="inverted" />
        </div>

        <div className="max-w-xl space-y-8">
          <div className="animate-in fade-in slide-in-from-left-6 space-y-5 duration-700">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-sky-300 uppercase">
              <Sparkles className="size-3.5" />
              সততায় ব্যবসার মূলধন
            </span>
            <h2 className="text-4xl leading-tight font-bold tracking-tight text-white xl:text-5xl">
              আপনার ডিজিটাল
              <br />
              ব্যবসা <span className="text-sky-400">শুরু করুন</span>
            </h2>
            <p className="max-w-md text-base leading-7 text-slate-400">
              RizqifyBD-তে যোগ দিয়ে MB, মিনিট, SMS, ইউটিলিটি বিল ও টিকিট
              সেবা — সব এক জায়গায় পরিচালনা করুন।
            </p>
          </div>

          <ul className="animate-in fade-in slide-in-from-left-6 space-y-3 duration-700 [animation-delay:120ms] [animation-fill-mode:both]">
            {FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-3 text-sm text-slate-300"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-sky-400">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                {feature}
              </li>
            ))}
          </ul>

          <div className="animate-in fade-in slide-in-from-left-6 grid max-w-md grid-cols-3 gap-4 duration-700 [animation-delay:220ms] [animation-fill-mode:both]">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
              >
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="mt-0.5 text-xs text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <figure className="animate-in fade-in slide-in-from-bottom-6 max-w-xl rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm duration-700 [animation-delay:320ms] [animation-fill-mode:both]">
          <div className="flex items-center gap-1 text-amber-400">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="size-3.5 fill-current" />
            ))}
          </div>
          <blockquote className="mt-3 text-sm leading-6 text-slate-300">
            “একটি প্ল্যাটফর্মে সব রিচার্জ ও বিল সেবা — কাজ সহজ হয়েছে,
            ব্যবসাও বেড়েছে।”
          </blockquote>
          <figcaption className="mt-3 flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-sky-500/20 text-sm font-semibold text-sky-300">
              AR
            </span>
            <span className="text-xs">
              <span className="block font-semibold text-white">
                আব্দুর রহিম
              </span>
              <span className="text-slate-400">রিটেইলার, ব্রাহ্মণবাড়িয়া</span>
            </span>
          </figcaption>
        </figure>
      </div>

      <div
        aria-hidden
        className="absolute right-8 bottom-8 flex items-center gap-2 text-xs text-slate-500"
      >
        <ShieldCheck className="size-4 text-emerald-500/70" />
        সুরক্ষিত সংযোগ
      </div>
      <TrendingUp
        aria-hidden
        className="absolute top-10 right-10 size-5 text-sky-500/30"
      />
      <Link href="/" className="sr-only">
        RizqifyBD হোম
      </Link>
    </aside>
  );
}
