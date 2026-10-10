"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { ModeToggle } from "@/components/theme/ModeToggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  getDashboardNavItems,
  getDashboardPageTitle,
} from "@/lib/dashboardNav";
import { DashboardMobileSidebar } from "./DashboardMobileSidebar";
import { DashboardUserMenu } from "./DashboardUserMenu";

export function DashboardNavbar() {
  const pathname = usePathname();
  const navSections = getDashboardNavItems(pathname);
  const pageTitle = getDashboardPageTitle(pathname, navSections);

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-background px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu />
            <span className="sr-only">Open navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <DashboardMobileSidebar />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 items-center gap-3">
        <h1 className="truncate text-lg font-semibold tracking-tight">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <ModeToggle />
        <DashboardUserMenu />
      </div>
    </header>
  );
}