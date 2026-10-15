"use client";

import React from "react";

import Link from "next/link";

import Image from "next/image";

import { Button } from "@/components/ui/button";

export default function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-surface/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="Unfold"
          >
            <Image
              src="/log.png"
              alt="Unfold"
              width={24}
              height={24}
              className="object-contain"
            />

            <span className="text-sm font-semibold tracking-tight text-main">
              Unfold
            </span>
          </Link>

          

          {/* Visitor actions */}
          <div className="flex items-center gap-4">
            <span className="text-muted text-xs">
              Read-only
            </span>
         
            <Button
              
              variant="outline"
              size="sm"
            >
              <Link href="/login">
                Log in
              </Link>
            </Button>

          </div>
        </div>
      </div>
    </header>
  );
}