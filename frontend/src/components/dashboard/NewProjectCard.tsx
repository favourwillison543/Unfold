"use client";

import Link from "next/link";

import { FiPlus } from "react-icons/fi";

export default function NewProjectCard() {
  return (
    <Link
      href="/project/new"
      className="rounded-2xl border border-dashed border-border p-5 flex flex-col items-center justify-center text-center gap-2 min-h-[176px] hover:border-brand hover:bg-brand/5 transition-colors group"
    >
      <div className="w-9 h-9 rounded-lg bg-background flex items-center justify-center text-muted group-hover:text-brand group-hover:bg-brand/10 transition-colors">
        <FiPlus className="w-4 h-4" />
      </div>

      <h3 className="text-sm font-semibold text-main">
        Create a new project
      </h3>

      <p className="text-xs text-muted leading-relaxed max-w-[160px]">
        Start with a product idea and unfold it.
      </p>
    </Link>
  );
}