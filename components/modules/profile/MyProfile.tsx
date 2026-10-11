"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertCircle, KeyRound, Pencil, RefreshCcw } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-auth";
import type { AuthUser } from "@/lib/auth-api";
import { AccountInfoCard } from "./AccountInfoCard";
import { ProfileDetailsCard } from "./ProfileDetailsCard";
import { ProfileEarningsCard } from "./ProfileEarningsCard";
import { ProfileEditDialog } from "./ProfileEditDialog";
import { ProfileHero } from "./ProfileHero";

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <Skeleton className="h-24 w-full rounded-none sm:h-28" />
        <CardContent className="-mt-12 flex items-end gap-4 sm:-mt-14">
          <Skeleton className="size-20 shrink-0 rounded-full sm:size-24" />
          <div className="flex-1 space-y-2 pb-1">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-5 w-40" />
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-5">
        <Skeleton className="h-72 rounded-xl lg:col-span-3" />
        <Skeleton className="h-72 rounded-xl lg:col-span-2" />
      </div>
    </div>
  );
}

function showEarnings(user: AuthUser): boolean {
  const appUser = user.appUser;
  if (!appUser) return false;
  return (
    appUser.canEarn ||
    appUser.referralIncomeEligible ||
    Number(appUser.balance) > 0 ||
    Number(appUser.totalEarned) > 0
  );
}

export function MyProfile() {
  const { data: user, isLoading, isError, error, refetch } = useCurrentUser();
  const [editOpen, setEditOpen] = useState(false);

  const handleEdit = () => {
    setEditOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <PageHeader
        title="My Profile"
        description="View your personal details, account status and wallet summary."
      >
        <Button type="button" variant="outline" onClick={handleEdit}>
          <Pencil />
          Edit Profile
        </Button>
        <Button asChild>
          <Link href="/change-password">
            <KeyRound />
            Change Password
          </Link>
        </Button>
      </PageHeader>

      {isLoading ? <ProfileSkeleton /> : null}

      {isError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Failed to load your profile</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Something went wrong. Please try again."}
          </AlertDescription>
          <AlertAction>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetch()}
            >
              <RefreshCcw />
              Retry
            </Button>
          </AlertAction>
        </Alert>
      ) : null}

      {!isLoading && !isError && !user ? (
        <Alert>
          <AlertCircle />
          <AlertTitle>Profile unavailable</AlertTitle>
          <AlertDescription>
            We couldn&apos;t find your profile details right now.
          </AlertDescription>
        </Alert>
      ) : null}

      {!isLoading && !isError && user ? (
        <>
          <ProfileHero user={user} />
          <div className="grid gap-6 lg:grid-cols-5">
            <ProfileDetailsCard user={user} className="lg:col-span-3" />
            <AccountInfoCard user={user} className="lg:col-span-2" />
          </div>
          {showEarnings(user) ? <ProfileEarningsCard user={user} /> : null}
          <ProfileEditDialog
            open={editOpen}
            onOpenChange={setEditOpen}
            user={user}
          />
        </>
      ) : null}
    </div>
  );
}
