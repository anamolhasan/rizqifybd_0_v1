"use client";

import Link from "next/link";
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
import { useCurrentUser, useLogout } from "@/hooks/use-auth";

export function DashboardUserMenu() {
  const { data: currentUser } = useCurrentUser();
  const logout = useLogout();

  const name = currentUser?.name ?? "Account";
  const email = currentUser?.email;
  const role = currentUser?.role;

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
            {email ? (
              <p className="text-xs text-muted-foreground">{email}</p>
            ) : null}
            {role ? (
              <p className="text-xs text-primary capitalize">
                {role.toLowerCase().replace("_", " ")}
              </p>
            ) : null}
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