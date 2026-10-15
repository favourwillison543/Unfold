"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import {
  FiPlus,
  FiGrid,
  FiFolder,
  FiSettings,
} from "react-icons/fi";

import { useMe } from "@/hooks/auth/useAuth";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: user } = useMe();

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const isOverviewActive = pathname === "/dashboard";
  const isProjectsActive =
    pathname === "/projects" || pathname.startsWith("/project/");
  const isSettingsActive = pathname === "/settings";

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-main font-sans">
      
      {/* Icon Rail Sidebar */}
      <aside className="flex w-16 shrink-0 flex-col items-center justify-between border-r border-white/10 bg-[#121212] py-4 text-white z-20">
        
        {/* Top Rail Navigation */}
        <div className="flex flex-col items-center gap-6">
          {/* Brand Logo */}
          <Link
            href="/dashboard"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.08] transition-all hover:bg-white/15"
            title="Unfold"
          >
            <Image
              src="/log.png"
              alt="Unfold"
              width={22}
              height={22}
              className="object-contain"
            />
          </Link>

          {/* Navigation Items */}
          <div className="flex flex-col items-center gap-3">
            <Link
              href="/project/new"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white shadow-md transition-all hover:bg-brand/90 hover:scale-105"
              title="New Project"
            >
              <FiPlus size={18} strokeWidth={2.2} />
            </Link>

            <Link
              href="/dashboard"
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                isOverviewActive
                  ? "bg-white/20 text-white"
                  : "text-neutral-400 hover:bg-white/10 hover:text-white"
              }`}
              title="Overview"
            >
              <FiGrid size={18} strokeWidth={1.8} />
            </Link>

            <Link
              href="/projects"
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                isProjectsActive
                  ? "bg-white/20 text-white"
                  : "text-neutral-400 hover:bg-white/10 hover:text-white"
              }`}
              title="Projects"
            >
              <FiFolder size={18} strokeWidth={1.8} />
            </Link>
          </div>
        </div>

        {/* Bottom Rail Actions */}
        <div className="flex flex-col items-center gap-3">
          <Link
            href="/settings"
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
              isSettingsActive
                ? "bg-white/20 text-white"
                : "text-neutral-400 hover:bg-white/10 hover:text-white"
            }`}
            title="Settings"
          >
            <FiSettings size={18} strokeWidth={1.8} />
          </Link>

          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white ring-1 ring-white/20"
            title={user?.name || "User"}
          >
            {userInitials}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="min-w-0 flex-1 overflow-y-auto bg-background text-main">
        {children}
      </main>
    </div>
  );
}