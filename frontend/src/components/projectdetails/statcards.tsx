"use client";

import { FiArrowRight } from "react-icons/fi";

export default function CoherenceStatCards() {
  return (
    <div className="w-full my-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Card 1 */}
        <div className="relative bg-surface rounded-xl border border-border p-3.5 flex items-center justify-between">
          <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-brand rounded-r" />
          <div className="pl-1.5">
            <h3 className="text-xs font-medium text-main">
              Product understood
            </h3>
            <p className="text-[11px] text-muted line-clamp-1 mt-0.5">
              Core entities and relationships mapped.
            </p>
          </div>
          <span className="text-[10px] font-medium text-muted bg-border/40 px-2 py-0.5 rounded-md shrink-0 ml-2">
            98%
          </span>
        </div>

        {/* Card 2 */}
        <div className="bg-surface rounded-xl border border-border p-3.5 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-medium text-main">
              Key questions answered
            </h3>
            <p className="text-[11px] text-muted line-clamp-1 mt-0.5">
              Business logic ambiguities clarified.
            </p>
          </div>
          <span className="text-[10px] font-medium text-muted bg-border/40 px-2 py-0.5 rounded-md shrink-0 ml-2">
            42
          </span>
        </div>

        {/* Card 3: Action Needed */}
        <div className="bg-amber-500/5 border border-amber-500/30 rounded-xl p-3.5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <h3 className="text-xs font-semibold text-main truncate">
                2 issues to review
              </h3>
            </div>
            <p className="text-[11px] text-muted truncate mt-0.5 pl-3">
              Payment gateway edge cases missing.
            </p>
          </div>

          <button className="text-[11px] font-medium text-amber-500 hover:text-amber-600 flex items-center gap-1 shrink-0">
            <span>Review</span>
            <FiArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}