"use client";

import React, {
  useState,
  useRef,
  useEffect,
} from "react";

import Link from "next/link";
import Image from "next/image";

import {
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiFolder,
} from "react-icons/fi";

import {
  useMe,
  useLogout,
} from "@/hooks/auth/useAuth";

type HeaderProps = {
  userAvatarUrl?: string;
};

export default function Header({
  userAvatarUrl,
}: HeaderProps) {
  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const { data: user } = useMe();

  const logout = useLogout();

  const userName = user?.name ?? "User";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          e.target as Node
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const initials = userName
    ? userName
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  const handleLogout = () => {
    setOpen(false);

    logout.mutate(undefined, {
      onSuccess: () => {
        window.location.href = "/login";
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-surface/90 backdrop-blur-md border-b border-border/70 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end h-12">

          {/* User Profile Dropdown - Far Right */}
          <div
            className="relative ml-auto"
            ref={menuRef}
          >
            <button
              type="button"
              onClick={() =>
                setOpen((prev) => !prev)
              }
              className="flex items-center gap-1 pl-1 pr-3 py-1 rounded-full border border-border/50 hover:border-border hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
              aria-expanded={open}
              aria-haspopup="true"
            >
              {userAvatarUrl ? (
                <Image
                  src={userAvatarUrl}
                  alt={userName}
                  width={28}
                  height={28}
                  className="rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-brand/10 text-brand lowercase text-[12px] font-bold flex items-center justify-center shrink-0 border border-brand/20">
                  {initials}
                </div>
              )}

              <span className="hidden sm:inline text-[12px] font-medium text-main truncate max-w-[140px]">
                {userName}
              </span>

              <FiChevronDown
                className={`w-3.5 h-3.5 text-muted transition-transform duration-200 shrink-0 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Menu Popover */}
            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-xl shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">

                {/* User Info Header */}
                <div className="px-3 py-2 mb-1 border-b border-border/60">
                  <p className="text-[10px] text-muted font-medium uppercase tracking-wider">
                    Signed in as
                  </p>

                  <p className="text-xs font-semibold text-main truncate mt-0.5">
                    {userName}
                  </p>
                </div>

                {/* Primary Actions */}
                <div className="space-y-0.5">
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-main hover:bg-black/[0.04] dark:hover:bg-white/[0.05] transition-colors"
                  >
                    <FiFolder className="w-4 h-4 text-muted" />
                    <span>Projects</span>
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-main hover:bg-black/[0.04] dark:hover:bg-white/[0.05] transition-colors"
                  >
                    <FiSettings className="w-4 h-4 text-muted" />
                    <span>Settings</span>
                  </Link>
                </div>

                {/* Logout */}
                <div className="pt-1 mt-1 border-t border-border/60">
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={logout.isPending}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiLogOut className="w-4 h-4" />

                    <span>
                      {logout.isPending
                        ? "Logging out..."
                        : "Log out"}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}