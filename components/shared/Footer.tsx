import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { BrandLogo } from "@/components/auth/BrandLogo";
import { BackToTop } from "@/components/shared/BackToTop";
import { Separator } from "@/components/ui/separator";

const linkCls =
  "inline-flex items-center gap-2.5 py-1.5 text-slate-400 transition hover:translate-x-1 hover:text-white";

function Heading({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <h4 className="mb-4 flex items-center gap-2.5 font-heading text-base font-extrabold text-white">
      <span
        className="size-2.5 rounded-full"
        style={{
          background: color,
          boxShadow: `0 0 12px ${color}, 0 0 24px ${color}`,
        }}
      />
      {children}
    </h4>
  );
}

export default async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const common = await getTranslations("common");

  const services = [
    { label: t("linkMbRecharge"), href: "#services" },
    { label: t("linkUtilityBill"), href: "#features" },
    { label: t("linkTicketSupport"), href: "#faq" },
  ];

  const company = [
    { label: nav("home"), href: "/" },
    { label: common("signIn"), href: "/login" },
    { label: common("signUp"), href: "/sign-up" },
  ];

  return (
    <footer className="relative isolate overflow-hidden bg-slate-950 text-slate-300">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-neon-cy to-transparent shadow-[0_0_22px_var(--cy)]"
      />
      <div
        aria-hidden
        className="hero-glow pointer-events-none absolute inset-0 -z-10 opacity-70"
      />

      <div className="mx-auto max-w-[1240px] px-6 pt-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <BrandLogo tone="inverted" className="mb-3.5" />
            <p className="max-w-[22em] leading-[1.8] text-slate-400">
              {t("description")}
            </p>
          </div>

          <nav aria-label={t("servicesAria")}>
            <Heading color="var(--cy)">{t("servicesHeading")}</Heading>
            <ul>
              {services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkCls}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("companyAria")}>
            <Heading color="var(--mg)">{t("companyHeading")}</Heading>
            <ul>
              {company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkCls}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <Heading color="var(--mi)">{t("contactHeading")}</Heading>
            <ul>
              <li>
                <a href="mailto:info@rizqifybd.com" className={linkCls}>
                  <Mail className="size-4 text-neon-mi" />
                  info@rizqifybd.com
                </a>
              </li>
              <li>
                <a href="tel:+8801607950556" className={linkCls}>
                  <Phone className="size-4 text-neon-mi" />
                  +880 1607 950556
                </a>
              </li>
              <li className="inline-flex items-center gap-2.5 py-1.5 text-slate-400">
                <MapPin className="size-4 text-neon-mi" />
                {nav("location")}
              </li>
            </ul>
          </div>
        </div>

        <Separator className="mt-11 bg-slate-800" />
        <div className="flex flex-wrap items-center justify-between gap-4 py-5 text-sm text-slate-500">
          <span>{t("copyright", { year: new Date().getFullYear() })}</span>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
