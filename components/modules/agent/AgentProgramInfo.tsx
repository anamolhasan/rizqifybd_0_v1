import {
  BadgeCheck,
  ClipboardList,
  HandCoins,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Card } from "@/components/ui/card";

const SECTIONS = [
  { key: "rules", icon: ClipboardList },
  { key: "eligibility", icon: BadgeCheck },
  { key: "benefits", icon: HandCoins },
] as const;

const HIGHLIGHTS = [
  { key: "reseller", icon: Store },
  { key: "secure", icon: ShieldCheck },
  { key: "commission", icon: TrendingUp },
] as const;

export function AgentProgramInfo() {
  const t = useTranslations("agent.info");

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
              {t("whyTitle")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("whyDescription")}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {HIGHLIGHTS.map((highlight) => {
            const Icon = highlight.icon;
            return (
              <div
                key={highlight.key}
                className="flex flex-col items-center gap-2 rounded-2xl border border-primary/10 bg-white/50 px-3 py-4 text-center backdrop-blur-sm"
              >
                <span className="grid size-9 place-items-center rounded-xl bg-primary/[0.08] text-primary">
                  <Icon className="size-4.5" strokeWidth={1.8} />
                </span>
                <span className="text-xs font-semibold text-muted-foreground sm:text-sm">
                  {t(`highlights.${highlight.key}`)}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {SECTIONS.map((section) => {
        const Icon = section.icon;
        const items = t.raw(`${section.key}Items`) as string[];
        return (
          <Card
            key={section.key}
            className="relative isolate overflow-hidden rounded-2xl border border-white/80 bg-white/55 p-6 shadow-lg shadow-primary/[0.04] ring-0 backdrop-blur-xl sm:rounded-3xl sm:p-7"
          >
            <div className="flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-primary/15 bg-primary/[0.08] text-primary">
                <Icon className="size-5" strokeWidth={1.8} />
              </span>
              <div>
                <h3 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
                  {t(`sections.${section.key}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(`sections.${section.key}.description`)}
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-3">
              {items.map((item) => (
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
