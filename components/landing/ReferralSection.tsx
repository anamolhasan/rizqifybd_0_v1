import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardList,
  Gift,
  Share2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const steps = [
  {
    number: "০১",
    title: "আবেদন করুন",
    description:
      "রেফারেল প্রোগ্রামে অংশ নিতে সংক্ষিপ্ত আবেদন ফর্মটি পূরণ করে জমা দিন।",
    icon: ClipboardList,
  },
  {
    number: "০২",
    title: "অনুমোদন পান",
    description:
      "আমাদের টিম আপনার আবেদন যাচাই করে দ্রুত সময়ের মধ্যে অনুমোদন সম্পন্ন করবে।",
    icon: BadgeCheck,
  },
  {
    number: "০৩",
    title: "রেফার করা শুরু করুন",
    description:
      "অনুমোদনের পর নিজের রেফারেল লিংক শেয়ার করুন এবং আয় করা শুরু করুন।",
    icon: Share2,
  },
];

export default function ReferralSection() {
  return (
    <section
      id="referral"
      className="relative isolate overflow-hidden bg-background py-16 sm:py-20 lg:py-28"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 size-105 -translate-x-1/2 rounded-full bg-primary/15 blur-[110px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/3 -z-10 size-80 rounded-full bg-emerald-300/20 blur-[100px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 -z-10 size-96 rounded-full bg-teal-200/25 blur-[110px]"
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="outline"
            className="h-auto gap-2 rounded-full border-primary/20 bg-white/60 px-4 py-2 text-sm font-semibold text-primary shadow-sm backdrop-blur-xl"
          >
            <span className="flex items-center">
              <Gift className="size-4" />
            </span>
            রেফারেল প্রোগ্রাম
          </Badge>

          <h2 className="mt-6 text-3xl leading-tight font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            বন্ধুদের রেফার করে বাড়ান আয়,
            <span className="mt-2 block bg-gradient-to-r from-primary via-emerald-600 to-teal-500 bg-clip-text text-transparent">
              গড়ুন বিশ্বস্ত কমিউনিটি
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
            RizqifyBD রেফারেল প্রোগ্রামে অংশ নিন, আপনার রেফারেল লিংক শেয়ার করুন
            এবং প্রতিটি সফল রেফারেলের জন্য আকর্ষণীয় আয় উপভোগ করুন।
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-12 grid grid-cols-1 gap-5 sm:mt-16 sm:gap-6 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={step.title} className="relative">
                <Card className="group relative flex h-full min-h-65 flex-col gap-0 overflow-hidden rounded-2xl border border-white/80 bg-white/55 p-6 ring-0 shadow-lg shadow-primary/4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:bg-white/70 hover:shadow-xl hover:shadow-primary/9 sm:rounded-3xl sm:p-7">
                  {/* Card ambient blur */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-primary/0 blur-3xl transition-colors duration-500 group-hover:bg-primary/15"
                  />

                  {/* Decorative step number */}
                  <span className="pointer-events-none absolute right-5 top-4 select-none text-4xl font-bold text-primary/[0.07] tabular-nums transition-colors duration-300 group-hover:text-primary/13">
                    {step.number}
                  </span>

                  {/* Icon */}
                  <div className="relative grid size-14 place-items-center rounded-2xl border border-primary/15 bg-primary/8 text-primary transition-all duration-300 group-hover:border-primary/25 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/20">
                    <Icon
                      size={25}
                      strokeWidth={1.7}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  {/* Card content */}
                  <div className="relative mt-6 flex-1">
                    <h3 className="text-lg font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary sm:text-xl">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>

                  {/* Card footer */}
                  <div className="relative mt-6 flex items-center justify-between border-t border-primary/10 pt-4">
                    <span className="rounded-full bg-white/40 px-3 py-1 text-xs font-semibold text-muted-foreground backdrop-blur-md">
                      ধাপ {step.number}
                    </span>

                    <span className="flex items-center gap-1.5">
                      {steps.map((_, dotIndex) => (
                        <span
                          key={dotIndex}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            dotIndex === index
                              ? "w-6 bg-primary"
                              : "w-1.5 bg-primary/20"
                          }`}
                        />
                      ))}
                    </span>
                  </div>

                  {/* Bottom accent */}
                  <div className="absolute inset-x-8 bottom-0 h-0.5 origin-center scale-x-0 rounded-full bg-linear-to-r from-transparent via-primary/70 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
                </Card>

                {/* Step connector */}
                {index < steps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 -right-6.5 z-10 hidden size-7 -translate-y-1/2 items-center justify-center rounded-full border border-primary/15 bg-white text-primary shadow-md shadow-primary/10 lg:flex"
                  >
                    <ArrowRight className="size-3.5" />
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-center gap-4 sm:mt-14">
          <Button
            asChild
            className="group/cta h-12 gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <Link href="/referral">
              রেফারেল প্রোগ্রামে যোগ দিন
              <ArrowRight className="size-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
            </Link>
          </Button>

          <p className="max-w-xl text-center text-xs text-muted-foreground sm:text-sm">
            অনুমোদনের পরেই রেফারেল কার্যক্রম সক্রিয় হবে — সম্পূর্ণ নিরাপদ ও স্বচ্ছ
            প্রক্রিয়া।
          </p>
        </div>
      </div>
    </section>
  );
}
