import { Check, ShieldCheck, Sparkles, Star, TrendingUp } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { BrandLogo } from "@/components/auth/BrandLogo";

export async function AuthBrandPanel() {
  const t = await getTranslations("auth");

  const features = [t("feature1"), t("feature2"), t("feature3")];

  const stats = [
    { value: "24/7", label: t("statSupport") },
    { value: "99.9%", label: t("statUptime") },
    { value: "10K+", label: t("statUsers") },
  ];

  return (
    <aside className="relative hidden min-h-screen overflow-hidden bg-slate-950 text-white lg:flex lg:w-1/2 lg:flex-col xl:w-[55%]">
      {/* Background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-size-[48px_48px]"
      />

      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-24 size-112 rounded-full bg-primary/25 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 size-104 rounded-full bg-success/15 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/3 size-72 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]"
      />

      {/* Main content */}
      <div className="relative z-10 flex w-full flex-1 flex-col justify-between gap-8 p-8 lg:p-10 xl:p-12 2xl:p-14">
        {/* Logo */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          <BrandLogo tone="inverted" />
        </div>

        {/* Main information */}
        <div className="my-auto w-full max-w-xl space-y-7 py-8 xl:space-y-8">
          <div className="animate-in fade-in slide-in-from-left-6 space-y-5 duration-700">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-primary uppercase">
              <Sparkles className="size-3.5 shrink-0" />
              {t("brandBadge")}
            </span>

            <h2 className="text-3xl leading-tight font-bold tracking-tight text-white xl:text-4xl 2xl:text-5xl">
              {t.rich("brandHeading", {
                highlight: (chunks) => (
                  <span className="text-primary">{chunks}</span>
                ),
                br: () => <br />,
              })}
            </h2>

            <p className="max-w-md text-sm leading-7 text-slate-400 xl:text-base">
              {t("brandDescription")}
            </p>
          </div>

          {/* Features */}
          <ul className="animate-in fade-in slide-in-from-left-6 space-y-3 duration-700 [animation-delay:120ms] fill-mode-[both]">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-sm leading-6 text-slate-300"
              >
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {/* Statistics */}
          <div className="animate-in fade-in slide-in-from-left-6 grid grid-cols-3 gap-3 duration-700 [animation-delay:220ms] fill-mode-[both] sm:gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="min-w-0 rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm xl:rounded-2xl xl:px-4"
              >
                <p className="text-lg font-bold text-white xl:text-xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <figure className="animate-in fade-in slide-in-from-bottom-6 w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm duration-700 [animation-delay:320ms] fill-mode-[both] sm:p-5">
          <div className="flex items-center gap-1 text-amber-400">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="size-3.5 fill-current" />
            ))}
          </div>

          <blockquote className="mt-3 text-sm leading-6 text-slate-300">
            {t("testimonialQuote")}
          </blockquote>

          <figcaption className="mt-3 flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
              AR
            </span>
            <span className="text-xs">
              <span className="block font-semibold text-white">
                {t("testimonialAuthor")}
              </span>
              <span className="text-slate-400">{t("testimonialRole")}</span>
            </span>
          </figcaption>
        </figure>
      </div>

      {/* Security indicator */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-5 bottom-3 flex items-center gap-2 text-xs text-slate-500 xl:right-8 xl:bottom-5"
      >
        <ShieldCheck className="size-4 text-success/70" />
        {t("secureConnection")}
      </div>

      <TrendingUp
        aria-hidden="true"
        className="pointer-events-none absolute top-8 right-8 size-5 text-primary/30"
      />
    </aside>
  );
}