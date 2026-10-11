"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { BrandLogo } from "@/components/auth/BrandLogo";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { AccountMenu } from "./AccountMenu";
import { MobileNavigation } from "./MobileNavigation";
import { SearchBar } from "./SearchBar";

export function MainHeader() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center gap-2">
        <MobileNavigation />

        <BrandLogo className="shrink-0" />

        <div className="hidden flex-1 justify-center px-4 md:flex">
          <SearchBar className="w-full max-w-2xl" />
        </div>

        <div className="ml-auto flex items-center gap-1.5 md:ml-0">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="সার্চ"
            aria-expanded={mobileSearchOpen}
            onClick={() => setMobileSearchOpen((value) => !value)}
          >
            <Search />
          </Button>

          <div className="hidden sm:block">
            <ThemeSwitcher />
          </div>

          <AccountMenu />
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden transition-[max-height,opacity] duration-200 md:hidden",
          mobileSearchOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="pb-3">
          <SearchBar autoFocus onSubmitted={() => setMobileSearchOpen(false)} />
        </div>
      </div>
    </div>
  );
}
