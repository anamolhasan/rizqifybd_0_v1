import {
  BadgeCheck,
  ClipboardList,
  Gift,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";

import { Card } from "@/components/ui/card";

const RULES = [
  "প্রতিটি অ্যাকাউন্ট থেকে কেবল একটি রেফারেল আবেদন জমা দেওয়া যাবে।",
  "ভুয়া, একাধিক বা নিজের রেফারেল গ্রহণযোগ্য নয়।",
  "রেফারেল আয় সক্রিয় হতে অবশ্যই অনুমোদিত আবেদন থাকতে হবে।",
  "শর্ত পূরণ হলে রেফারেল আয় সরাসরি আপনার ওয়ালেটে যোগ হবে।",
  "নিয়ম লঙ্ঘন প্রমাণিত হলে প্রোগ্রাম থেকে বাদ দেওয়া হতে পারে।",
];

const ELIGIBILITY = [
  "একটি সক্রিয় ও ভেরিফায়েড RizqifyBD গ্রাহক অ্যাকাউন্ট থাকতে হবে।",
  "অ্যাকাউন্ট নিষিদ্ধ বা ডিলিট করা অবস্থায় থাকতে পারবে না।",
  "প্রোগ্রামের শর্তাবলী ও নিয়মাবলীতে সম্মতি দিতে হবে।",
  "সৎ ও স্বচ্ছ উপায়ে প্রমোশন পরিচালনা করতে হবে।",
  "নিয়মিত সক্রিয় রেফারেল থাকলে যোগ্যতা বজায় থাকে।",
];

const BENEFITS = [
  "প্রতিটি সফল রেফারেলে আকর্ষণীয় আয়।",
  "আয় সরাসরি ওয়ালেটে — সহজে উইথড্র করা যায়।",
  "ড্যাশবোর্ড থেকেই সম্পূর্ণ ট্র্যাকিং ও রিপোর্ট।",
  "সম্পূর্ণ নিরাপদ, স্বচ্ছ ও যাচাইকৃত প্রক্রিয়া।",
  "দ্রুত অনুমোদন ও ন্যায্য মূল্যায়ন।",
];

const SECTIONS = [
  {
    title: "প্রোগ্রামের নিয়মাবলী",
    description: "প্রোগ্রামে অংশ নেওয়ার আগে নিয়মগুলো জেনে নিন।",
    icon: ClipboardList,
    items: RULES,
  },
  {
    title: "যোগ্যতার শর্ত",
    description: "আবেদন করার জন্য যা যা প্রয়োজন।",
    icon: BadgeCheck,
    items: ELIGIBILITY,
  },
  {
    title: "সুবিধা ও আয়",
    description: "রেফারেল প্রোগ্রামে যা যা পাবেন।",
    icon: Gift,
    items: BENEFITS,
  },
];

const HIGHLIGHTS = [
  { icon: Wallet, label: "ওয়ালেটে সরাসরি আয়" },
  { icon: ShieldCheck, label: "নিরাপদ ও স্বচ্ছ" },
  { icon: Users, label: "সক্রিয় কমিউনিটি" },
];

export function ReferralProgramInfo() {
  return (
    <div className="space-y-6">
      <Card className="relative isolate overflow-hidden rounded-2xl border border-white/80 bg-white/55 p-6 shadow-lg shadow-primary/[0.04] ring-0 backdrop-blur-xl sm:rounded-3xl sm:p-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 -z-10 size-40 rounded-full bg-primary/10 blur-3xl"
        />

        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl border border-primary/15 bg-primary/[0.08] text-primary">
            <Sparkles className="size-5" strokeWidth={1.8} />
          </span>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
              কেন রেফারেল প্রোগ্রামে যোগ দেবেন?
            </h2>
            <p className="text-sm text-muted-foreground">
              একটি আবেদনেই শুরু হোক আপনার অতিরিক্ত আয়ের পথ।
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {HIGHLIGHTS.map((highlight) => {
            const Icon = highlight.icon;
            return (
              <div
                key={highlight.label}
                className="flex flex-col items-center gap-2 rounded-2xl border border-primary/10 bg-white/50 px-3 py-4 text-center backdrop-blur-sm"
              >
                <span className="grid size-9 place-items-center rounded-xl bg-primary/[0.08] text-primary">
                  <Icon className="size-4.5" strokeWidth={1.8} />
                </span>
                <span className="text-xs font-semibold text-muted-foreground sm:text-sm">
                  {highlight.label}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {SECTIONS.map((section) => {
        const Icon = section.icon;
        return (
          <Card
            key={section.title}
            className="relative isolate overflow-hidden rounded-2xl border border-white/80 bg-white/55 p-6 shadow-lg shadow-primary/[0.04] ring-0 backdrop-blur-xl sm:rounded-3xl sm:p-7"
          >
            <div className="flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-primary/15 bg-primary/[0.08] text-primary">
                <Icon className="size-5" strokeWidth={1.8} />
              </span>
              <div>
                <h3 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
                  {section.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-3">
              {section.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-sm leading-6 text-muted-foreground">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        );
      })}
    </div>
  );
}
