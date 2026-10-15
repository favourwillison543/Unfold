"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import { FiArrowLeft } from "react-icons/fi";

import {
  useProjectStructure,
  useProjectWorkflows,
} from "@/hooks/useWorkflow";

import ActorWorkflowCanvas from "./ActorWorkflowCanvas";

import LoadingScreen from "../ui/LoadingScreen";

import WorkflowSidebar, {
  getWorkflowPages,
} from "./workflowsidebar";

type WorkflowDetailPageProps = {
  projectId: number;
  workflowId: number;
};

export default function WorkflowDetailPage({
  projectId,
  workflowId,
}: WorkflowDetailPageProps) {
  const actorId = Number(workflowId);

  const [selectedPage, setSelectedPage] =
    useState<string | null>(null);

  const [completedPages, setCompletedPages] =
    useState<Record<string, boolean>>({});

  const {
    data: structure,
    isLoading: isStructureLoading,
    isError: isStructureError,
  } = useProjectStructure(projectId);

  const {
    data: workflows = [],
    isLoading: isWorkflowsLoading,
    isError: isWorkflowsError,
  } = useProjectWorkflows(projectId);

  const actor = structure?.actors.find(
    (item) => item.id === actorId,
  );

  const actorWorkflows = actor
    ? workflows.filter(
      (workflow) =>
        workflow.actor === actor.name,
    )
    : [];

  const pages = useMemo(
    () => getWorkflowPages(actorWorkflows),
    [actorWorkflows],
  );

  const handleSelectPage = (
    pageName: string,
  ) => {
    setSelectedPage((current) =>
      current === pageName
        ? null
        : pageName,
    );
  };

  const handleToggleComplete = (
    pageName: string,
  ) => {
    setCompletedPages((current) => ({
      ...current,
      [pageName]:
        !current[pageName],
    }));
  };

  if (
    isStructureLoading ||
    isWorkflowsLoading
  ) {
    return (
      <div className="mx-auto w-full max-w-[95%]">
        <LoadingScreen />
      </div>
    );
  }

  if (
    isStructureError ||
    isWorkflowsError
  ) {
    return (
      <div className="mx-auto w-full max-w-[95%]">
        <div className="mt-6 py-6">
          <div className="border-y border-border/60 py-12">
            <p className="text-sm font-semibold text-main">
              Failed to load workflows
            </p>

            <p className="mt-2 text-xs leading-5 text-muted">
              The workflow request could not
              be completed.
            </p>

            <Link
              href={`/project/${projectId}?tab=workflows`}
              className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-brand"
            >
              <FiArrowLeft className="h-3.5 w-3.5" />
              Back to workflows
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!actor) {
    return (
      <div className="mx-auto w-full max-w-[90%]">
        <div className="mt-6 py-6">
          <div className="border-y border-border/60 py-12">
            <p className="text-sm font-semibold text-main">
              Actor not found
            </p>

            <Link
              href={`/project/${projectId}?tab=workflows`}
              className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-brand"
            >
              <FiArrowLeft className="h-3.5 w-3.5" />
              Back to workflows
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[95%]">
      <div className="mt-6 pb-8">
        <div
          className="
            flex
            min-h-[calc(100vh-120px)]
            flex-col
            gap-8
            lg:flex-row
            lg:items-stretch
            lg:gap-3
          "
        >
          {/* Canvas */}
          <div className="min-h-0 min-w-0 flex-1">
            {actorWorkflows.length === 0 &&
              structure?.publicFlow?.length === 0 ? (
              <div className="flex min-h-[calc(100vh-120px)] items-center justify-center rounded-2xl border border-gray-100 bg-[#fbfbfd]">
                <div className="text-center">
                  <p className="text-sm font-semibold text-main">
                    No workflows generated
                  </p>

                  <p className="mt-2 text-xs leading-5 text-muted">
                    No saved workflows were found
                    for this actor.
                  </p>
                </div>
              </div>
            ) : (
              <ActorWorkflowCanvas
                workflows={actorWorkflows}
                highlightedPage={selectedPage}
                publicFlow={structure?.publicFlow ?? []}
              />
            )}
          </div>

          {/* Sticky Sidebar */}
          <div
            className="
              shrink-0
              lg:sticky
              lg:top-6
              lg:w-90
              lg:self-start
            "
          >
            <WorkflowSidebar
              projectId={projectId}
              actorName={actor.name}
              actorDescription={actor.description}
              workflows={actorWorkflows}
              pages={pages}
              selectedPage={selectedPage}
              completedPages={completedPages}
              onSelectPage={handleSelectPage}
              onToggleComplete={handleToggleComplete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}