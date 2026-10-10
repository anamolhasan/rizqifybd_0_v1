"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Key, Loader2, LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getDashboardSession } from "@/lib/dashboardNav";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";

export function DashboardUserMenu() {
  const pathname = usePathname();
  const session = getDashboardSession(pathname);
  const { data: currentUser } = useCurrentUser();
  const logout = useLogout();

  const name = currentUser?.name ?? session.name;
  const email = currentUser?.email ?? session.email;
  const role = currentUser?.role ?? session.role;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          aria-label="Account menu"
        >
          <span className="text-sm font-semibold">
            {name.charAt(0).toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
            <p className="text-xs text-sky-600 capitalize dark:text-sky-400">
              {role.toLowerCase().replace("_", " ")}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Link href="/my-profile" className="flex w-full items-center gap-2">
            <User />
            My Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link href="/change-password" className="flex w-full items-center gap-2">
            <Key />
            Change Password
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          disabled={logout.isPending}
          onClick={() => logout.mutate()}
        >
          {logout.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <LogOut />
          )}
          {logout.isPending ? "Signing out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}