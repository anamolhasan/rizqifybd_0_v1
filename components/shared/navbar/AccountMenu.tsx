"use client";

import Link from "next/link";
import {
  ChevronDown,
  Key,
  LayoutDashboard,
  Loader2,
  LogOut,
  User,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { isStaffRole, type Role } from "@/types/enums";

export function AccountMenu() {
  const { data: user, isLoading } = useCurrentUser();
  const logout = useLogout();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden h-9 w-20 animate-pulse rounded-lg bg-muted md:block" />
        <span className="size-9 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="লগ ইন"
        >
          <Link href="/login">
            <UserRound />
          </Link>
        </Button>
        <Button asChild variant="outline" className="hidden md:inline-flex">
          <Link href="/login">লগ ইন</Link>
        </Button>
        <Button
          asChild
          className="hidden bg-primary text-primary-foreground hover:bg-primary/90 md:inline-flex"
        >
          <Link href="/sign-up">সাইন আপ</Link>
        </Button>
      </div>
    );
  }

  const role = user.role as Role;
  const dashboardHref = getDefaultDashboardRoute(role);
  const dashboardLabel = isStaffRole(role) ? "অ্যাডমিন ড্যাশবোর্ড" : "ড্যাশবোর্ড";
  const initial = (user.name ?? user.email ?? "?").charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-9 gap-1.5 rounded-full px-1.5 md:px-2"
          aria-label="অ্যাকাউন্ট মেনু"
        >
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-slate-950">
            {initial}
          </span>
          <span className="hidden max-w-28 truncate text-sm font-medium md:block">
            {user.name ?? "আমার অ্যাকাউন্ট"}
          </span>
          <ChevronDown className="hidden size-3.5 text-muted-foreground md:block" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-0.5">
            <p className="truncate text-sm font-medium">
              {user.name ?? "RizqifyBD ব্যবহারকারী"}
            </p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            <p className="text-xs text-primary capitalize">
              {role.toLowerCase().replace(/_/g, " ")}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={dashboardHref} className="flex w-full items-center gap-2">
            <LayoutDashboard />
            {dashboardLabel}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/my-profile" className="flex w-full items-center gap-2">
            <User />
            আমার প্রোফাইল
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/change-password" className="flex w-full items-center gap-2">
            <Key />
            পাসওয়ার্ড পরিবর্তন
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          disabled={logout.isPending}
          onClick={() => logout.mutate()}
        >
          {logout.isPending ? <Loader2 className="animate-spin" /> : <LogOut />}
          {logout.isPending ? "সাইন আউট হচ্ছে..." : "লগ আউট"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
