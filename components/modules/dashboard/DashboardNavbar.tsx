"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/components/language/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DashboardBreadcrumb } from "./DashboardBreadcrumb";
import { DashboardMobileSidebar } from "./DashboardMobileSidebar";
import { DashboardUserMenu } from "./DashboardUserMenu";

export function DashboardNavbar() {
  const t = useTranslations();

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-background px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu />
            <span className="sr-only">{t("nav.openMenu")}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <DashboardMobileSidebar />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 items-center gap-3">
        <DashboardBreadcrumb />
      </div>

      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeSwitcher />
        <DashboardUserMenu />
      </div>
    </header>
  );
}
