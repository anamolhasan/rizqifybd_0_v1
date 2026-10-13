import { getTranslations } from "next-intl/server";

import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { BrandLogo } from "@/components/auth/BrandLogo";
import { LanguageSwitcher } from "@/components/language/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = await getTranslations("footer");

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AuthBrandPanel />

      <div className="flex w-full flex-col lg:w-1/2 xl:w-[45%]">
        <header className="flex items-center justify-end gap-3 p-6">
          <BrandLogo className="lg:hidden" />
          <LanguageSwitcher />
        </header>

        <div className="flex flex-1 items-center justify-center px-6 pb-10 lg:px-10">
          <div className="w-full max-w-md">{children}</div>
        </div>

        <footer className="p-6 text-center text-xs text-muted-foreground">
          {t("copyrightShort", { year: new Date().getFullYear() })}
        </footer>
      </div>
    </div>
  );
}
