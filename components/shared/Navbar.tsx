'use client'
import Link from "next/link";
import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/theme/ModeToggle";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(()=>{
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)

    return ()=> window.removeEventListener('scroll', handleScroll)
  },[])
  return (
    <header  className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/20 backdrop-blur-md"
          : "bg-slate-950 backdrop-blur-sm"
      }`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold tracking-tight text-white">
          RizqifyBD
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm font-medium text-slate-300 transition hover:text-white">
            হোম
          </Link>
          <Link href="#services" className="text-sm font-medium text-slate-300 transition hover:text-white">
            সেবা
          </Link>
          <Link href="#features" className="text-sm font-medium text-slate-300 transition hover:text-white">
            আমাদের সম্পর্কে
          </Link>
          <Link href="#faq" className="text-sm font-medium text-slate-300 transition hover:text-white">
            প্রশ্ন
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <span>
            <ModeToggle />
          </span>
          <Link
            href="/login"
            className="hidden rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-400 hover:text-white md:inline-flex"
          >
            লগ ইন
          </Link>
          <Link
            href="/sign-up"
            className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            সাইন আপ
          </Link>
        </div>
      </div>
    </header>
  );
}
