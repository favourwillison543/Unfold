"use client";

import { FiCheckCircle } from "react-icons/fi";

export default function ProjectStepper() {
  return (
    <div className="py-6 border-b border-border my-6 overflow-x-auto">
      <div className="flex items-center gap-4 text-xs font-medium min-w-max">
        <div className="flex items-center gap-2 text-brand">
          <FiCheckCircle className="w-4 h-4" />
          <span>Understanding</span>
        </div>
        <div className="h-px w-8 bg-border" />

        <div className="flex items-center gap-2 text-brand">
          <FiCheckCircle className="w-4 h-4" />
          <span>People & Roles</span>
        </div>
        <div className="h-px w-8 bg-border" />

        <div className="flex items-center gap-2 text-brand font-semibold">
          <span className="w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center text-[10px]">
            3
          </span>
          <span>Questions</span>
        </div>
        <div className="h-px w-8 bg-border" />

        <div className="flex items-center gap-2 text-muted">
          <span className="w-4 h-4 rounded-full border border-border flex items-center justify-center text-[10px]">
            &ndash;
          </span>
          <span>Workflows (In progress)</span>
        </div>
        <div className="h-px w-8 bg-border" />

        <div className="flex items-center gap-2 text-muted">
          <span className="w-4 h-4 rounded-full border border-border flex items-center justify-center text-[10px]">
            &thinsp;
          </span>
          <span>Challenge</span>
        </div>
      </div>
    </div>
  );
}