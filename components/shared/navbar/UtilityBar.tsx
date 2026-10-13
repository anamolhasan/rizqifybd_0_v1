import Link from "next/link";
import { Headphones, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { PUBLIC_NAV_LINKS, SUPPORT_EMAIL, SUPPORT_PHONE } from "./nav-config";

interface UtilityBarProps {
  className?: string;
}

export function UtilityBar({ className }: UtilityBarProps) {
  const t = useTranslations("nav");
  const faqLink = PUBLIC_NAV_LINKS.find((link) => link.href === "/faq");

  return (
    <div className={cn("bg-slate-950 text-slate-300", className)}>
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-4 text-xs sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <a
            href={`tel:${SUPPORT_PHONE.replace(/\s+/g, "")}`}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
          >
            <Phone className="size-3.5 text-primary" />
            <span>{SUPPORT_PHONE}</span>
          </a>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
          >
            <Headphones className="size-3.5 text-primary" />
            <span>{t("customerSupport")}</span>
          </a>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-1.5 text-slate-400 lg:inline-flex">
            <MapPin className="size-3.5 text-primary" />
            {t("location")}
          </span>
          {faqLink ? (
            <Link
              href={faqLink.href}
              className="font-medium text-slate-200 transition-colors hover:text-white"
            >
              {t("helpAndFaq")}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
