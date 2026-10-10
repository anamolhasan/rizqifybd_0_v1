"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { MainHeader } from "./navbar/MainHeader";
import { PrimaryNavigation } from "./navbar/PrimaryNavigation";
import { UtilityBar } from "./navbar/UtilityBar";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn("sticky top-0 z-50 w-full", scrolled && "shadow-sm")}>
      <div
        className={cn(
          "hidden overflow-hidden transition-[max-height,opacity] duration-300 md:block",
          scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100",
        )}
      >
        <UtilityBar />
      </div>

      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <MainHeader />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PrimaryNavigation />
        </div>
      </div>
    </header>
  );
}
