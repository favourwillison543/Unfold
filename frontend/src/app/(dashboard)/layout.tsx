"use client";

import React, { useEffect } from "react";

import { useRouter } from "next/navigation";

import Header from "@/components/dashboard/Header";
import AppShell from "@/components/dashboard/appshell";

import { useMe } from "@/hooks/auth/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { data: user, isLoading, isError } = useMe();

  useEffect(() => {
    if (!isLoading && isError) {
      router.replace("/login");
    }
  }, [isLoading, isError, router]);

  // Auth is still being checked.
  // Keep the dashboard mounted instead of replacing it
  // with the full LoadingScreen.
  if (isLoading) {
    return (
      <AppShell>
        <Header />
        {children}
      </AppShell>
    );
  }

  // The redirect is being handled by the effect.
  if (isError || !user) {
    return null;
  }

  return (
    <AppShell>
      <Header />
      {children}
    </AppShell>
  );
}