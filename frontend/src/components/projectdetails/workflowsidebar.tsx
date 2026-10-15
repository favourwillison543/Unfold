"use client";

import Link from "next/link";

import {
  FiArrowLeft,
  FiCheck,
  FiLayout,
  FiUser,
  FiTarget,
  FiLogIn,
  FiFlag,
} from "react-icons/fi";

import { Workflow } from "@/types/workflow";

export type WorkflowPageItem = {
  name: string;
  purpose?: string;
  workflowNames: string[];
};

type WorkflowSidebarProps = {
  projectId: number;
  actorName: string;
  actorDescription?: string;
  workflows: Workflow[];
  pages: WorkflowPageItem[];
  selectedPage: string | null;
  completedPages: Record<string, boolean>;
  onSelectPage: (pageName: string) => void;
  onToggleComplete: (pageName: string) => void;
};

export function getWorkflowPages(
  workflows: Workflow[],
): WorkflowPageItem[] {
  const map = new Map<
    string,
    {
      name: string;
      purpose?: string;
      workflowNames: Set<string>;
    }
  >();

  for (const workflow of workflows) {
    for (const page of workflow.pages ?? []) {
      const existing = map.get(page.name);

      if (existing) {
        existing.workflowNames.add(workflow.name);

        if (!existing.purpose && page.purpose) {
          existing.purpose = page.purpose;
        }
      } else {
        map.set(page.name, {
          name: page.name,
          purpose: page.purpose,
          workflowNames: new Set([workflow.name]),
        });
      }
    }
  }

  return Array.from(map.values()).map((item) => ({
    name: item.name,
    purpose: item.purpose,
    workflowNames: Array.from(item.workflowNames),
  }));
}

export default function WorkflowSidebar({
  projectId,
  actorName,
  actorDescription,
  workflows,
  pages,
  selectedPage,
  completedPages,
  onSelectPage,
  onToggleComplete,
}: WorkflowSidebarProps) {
  const doneCount = pages.filter(
    (page) => completedPages[page.name],
  ).length;

  return (
    <aside className="w-full shrink-0 border-b border-slate-200/80 pb-8 pt-4 lg:border-b-0 lg:pb-0">
      {/* Back Button */}
      <Link
        href={`/project/${projectId}?tab=workflows`}
        className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted transition-colors hover:bg-slate-100 hover:text-slate-900"
      >
        <FiArrowLeft className="h-3.5 w-3.5 text-slate-400" />
        Back to workflows
      </Link>

      {/* Actor Header */}
      <div className="mt-4 rounded-xl border border-slate-200/70 bg-gradient-to-b from-slate-50/80 to-white p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand/20 bg-brand/10 text-brand">
            <FiUser className="h-4.5 w-4.5" />
          </span>

          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-brand">
              Actor workflow
            </p>

            <h1 className="mt-0.5 truncate text-sm font-bold text-slate-900">
              {actorName}
            </h1>
          </div>
        </div>

        {actorDescription && (
          <p className="mt-3 text-xs leading-relaxed text-slate-600">
            {actorDescription}
          </p>
        )}
      </div>

      {/* Workflow Information Cards */}
      <div className="mt-6 space-y-4">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className="space-y-3.5 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs"
          >
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                {workflow.name}
              </h2>

              {workflow.description && (
                <p className="mt-1 text-xs leading-normal text-slate-500">
                  {workflow.description}
                </p>
              )}
            </div>

            {/* Goal */}
            {workflow.goal && (
              <div className="rounded-lg border border-brand/15 bg-brand/5 p-2.5">
                <div className="flex items-center gap-1.5 text-brand">
               

                  <p className="text-[11px] font-semibold">
                    Goal
                  </p>
                </div>

                <p className="mt-1 text-xs leading-snug text-slate-800">
                  {workflow.goal}
                </p>
              </div>
            )}

            {/* Entry Point */}
            {workflow.entryPoint && (
              <div className="rounded-lg border border-brand/15 bg-brand/5 p-2.5">
                <div className="flex items-center gap-1.5 text-brand">
                  <FiLogIn className="h-3.5 w-3.5 shrink-0" />

                  <p className="text-[11px] font-semibold">
                    Entry Point
                  </p>
                </div>

                <p className="mt-1 text-xs leading-snug text-slate-800">
                  {workflow.entryPoint}
                </p>
              </div>
            )}

            {/* Outcome */}
            {workflow.completion && (
              <div className="rounded-lg border border-brand/15 bg-brand/5 p-2.5">
                <div className="flex items-center gap-1.5 text-brand">
                  <FiFlag className="h-3.5 w-3.5 shrink-0" />

                  <p className="text-[11px] font-semibold">
                    Outcome
                  </p>
                </div>

                <p className="mt-1 text-xs leading-snug text-slate-800">
                  {workflow.completion}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Screens Checklist */}
      <div className="mt-8">
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
          <div>
            <p className="text-xs font-bold text-slate-900">
              Screens
            </p>

            <p className="mt-0.5 text-[11px] text-slate-500">
              Select to highlight on graph
            </p>
          </div>

          <span className="text-[11px] font-semibold text-slate-500">
            {doneCount} / {pages.length}
          </span>
        </div>

        <div className="mt-3 space-y-1.5">
          {pages.map((page) => {
            const isSelected =
              selectedPage === page.name;

            const isCompleted =
              completedPages[page.name];

            return (
              <div
                key={page.name}
                className={`
                  group
                  flex
                  items-start
                  gap-2.5
                  rounded-xl
                  border
                  p-2.5
                  transition-all
                  duration-150
                  ${
                    isSelected
                      ? "border-brand/30 bg-brand/5 shadow-xs ring-1 ring-brand/15"
                      : "border-transparent hover:border-slate-200 hover:bg-slate-50/80"
                  }
                `}
              >
                {/* Checkbox */}
                <button
                  type="button"
                  onClick={() =>
                    onToggleComplete(page.name)
                  }
                  aria-label={
                    isCompleted
                      ? `Mark ${page.name} as incomplete`
                      : `Mark ${page.name} as complete`
                  }
                  className={`
                    mt-0.5
                    flex
                    h-4
                    w-4
                    shrink-0
                    items-center
                    justify-center
                    rounded
                    border
                    transition-all
                    ${
                      isCompleted
                        ? "border-brand bg-brand text-white shadow-xs"
                        : "border-slate-300 bg-white text-transparent hover:border-slate-400"
                    }
                  `}
                >
                  <FiCheck className="h-3 w-3 stroke-[3]" />
                </button>

                {/* Screen Selection */}
                <button
                  type="button"
                  onClick={() =>
                    onSelectPage(page.name)
                  }
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="flex items-start gap-2">
                    <FiLayout
                      className={`
                        mt-0.5
                        h-4
                        w-4
                        shrink-0
                        transition-colors
                        ${
                          isSelected
                            ? "text-brand"
                            : isCompleted
                              ? "text-brand/70"
                              : "text-slate-400 group-hover:text-slate-600"
                        }
                      `}
                    />

                    <div className="min-w-0">
                      <p
                        className={`
                          text-xs
                          font-semibold
                          leading-tight
                          ${
                            isCompleted
                              ? "text-slate-400 line-through"
                              : isSelected
                                ? "text-brand"
                                : "text-slate-800"
                          }
                        `}
                      >
                        {page.name}
                      </p>

                      {page.purpose && (
                        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-500">
                          {page.purpose}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              </div>
            );
          })}

          {pages.length === 0 && (
            <p className="rounded-xl border border-dashed border-slate-200 py-4 text-center text-xs text-slate-400">
              No screens found for this workflow.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}