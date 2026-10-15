"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { FiArrowRight } from "react-icons/fi";

import { Analysis } from "@/types/project";

import {
  useGenerateActorWorkflows,
  useProjectPublicFlow,
  useProjectStructure,
  useProjectWorkflows,
} from "@/hooks/useWorkflow";

type WorkflowsTabProps = {
  analysis: Analysis;
  projectId: number;
};

export default function WorkflowsTab({
  analysis,
  projectId,
}: WorkflowsTabProps) {
  const router = useRouter();

  const {
    data: structure,
    isLoading: isStructureLoading,
    isError: isStructureError,
    refetch: refetchStructure,
  } = useProjectStructure(projectId);

  const {
    data: publicFlow = [],
    isLoading: isPublicFlowLoading,
    isError: isPublicFlowError,
  } = useProjectPublicFlow(projectId);

  const {
    data: workflows = [],
    isLoading: isWorkflowsLoading,
  } = useProjectWorkflows(projectId);

  const generateActorWorkflows =
    useGenerateActorWorkflows();

  const [generatingActorId, setGeneratingActorId] =
    useState<number | null>(null);

  const [isOpeningFullStructure, setIsOpeningFullStructure] =
    useState(false);

  const actors = structure?.actors ?? [];

  const actorsWithWorkflows = actors.filter((actor) =>
    workflows.some(
      (workflow) => workflow.actor === actor.name,
    ),
  );

  const allActorWorkflowsReady =
    actors.length > 0 &&
    actorsWithWorkflows.length === actors.length;

  const handleActorSelect = async (actorId: number) => {
    const actor = actors.find(
      (item) => item.id === actorId,
    );

    if (!actor) {
      return;
    }

    const existingWorkflows = workflows.filter(
      (workflow) => workflow.actor === actor.name,
    );

    if (existingWorkflows.length > 0) {
      router.push(
        `/projects/${projectId}/workflows/${actor.id}`,
      );
      return;
    }

    try {
      setGeneratingActorId(actor.id);

      await generateActorWorkflows.mutateAsync({
        projectId,
        actorId,
      });

      router.push(
        `/projects/${projectId}/workflows/${actor.id}`,
      );
    } catch (error) {
      console.error(
        "FAILED TO GENERATE ACTOR WORKFLOWS:",
        error,
      );
    } finally {
      setGeneratingActorId(null);
    }
  };

  const handleViewFullStructure = async () => {
    try {
      setIsOpeningFullStructure(true);

      const result = await refetchStructure();

      if (!result.isSuccess) {
        console.error(
          "FAILED TO LOAD PROJECT STRUCTURE:",
          result.error,
        );
        return;
      }

      router.push(
        `/projects/${projectId}/workflows`,
      );
    } catch (error) {
      console.error(
        "FAILED TO LOAD PROJECT STRUCTURE:",
        error,
      );
    } finally {
      setIsOpeningFullStructure(false);
    }
  };

  if (isStructureLoading) {
    return (
      <div className="mt-6">
        <div className="border-b border-border/60 pb-6">
          <h2 className="text-xl font-semibold text-main">
            Workflows
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted">
            How each actor moves through the product.
          </p>
        </div>

        <div className="py-12 text-sm text-muted">
          Loading product structure...
        </div>
      </div>
    );
  }

  if (isStructureError) {
    return (
      <div className="mt-6">
        <div className="border-b border-border/60 pb-6">
          <h2 className="text-xl font-semibold text-main">
            Workflows
          </h2>
        </div>

        <div className="mt-6 py-10">
          <p className="text-sm font-semibold text-main">
            Product structure could not be loaded
          </p>

          <p className="mt-2 text-xs text-muted">
            There was a problem loading the actors.
          </p>
        </div>
      </div>
    );
  }

  if (actors.length === 0) {
    return (
      <div className="mt-6">
        <div className="border-b border-border/60 pb-6">
          <h2 className="text-xl font-semibold text-main">
            Workflows
          </h2>
        </div>

        <div className="mt-6 py-10">
          <p className="text-sm font-semibold text-main">
            No actors generated yet
          </p>

          <p className="mt-2 text-xs text-muted">
            Generate the product structure first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="border-b border-border/60 pb-6">
        <h2 className="text-xl font-semibold text-main">
          Workflows
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Follow the product from its public entry into the
          experiences each actor needs.
        </p>
      </div>

      {/* Public flow */}
      <section className="py-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          Public flow
        </p>

        <h3 className="mt-1.5 text-lg font-semibold text-main">
          Where the product begins
        </h3>

        {isPublicFlowLoading ? (
          <div className="py-10 text-sm text-muted">
            Loading public flow...
          </div>
        ) : isPublicFlowError ? (
          <div className="py-10 text-sm text-main">
            Public flow could not be loaded.
          </div>
        ) : publicFlow.length === 0 ? (
          <div className="py-10 text-sm text-muted">
            No public entry points were generated.
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <div className="flex min-w-max items-stretch">
              {publicFlow.map((page, index) => (
                <div key={page.id} className="flex items-stretch">
                  <div className="flex w-[200px] flex-col rounded-lg border border-border bg-surface p-4">
                    <span className="text-[11px] font-medium tabular-nums text-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <p className="mt-2 text-sm font-semibold text-main">
                      {page.name}
                    </p>

                    {page.purpose && (
                      <p className="mt-1.5 text-xs leading-5 text-muted">
                        {page.purpose}
                      </p>
                    )}
                  </div>

                  {index < publicFlow.length - 1 && (
                    <div className="flex w-10 shrink-0 items-center justify-center">
                      <FiArrowRight className="h-4 w-4 text-muted" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Actors */}
      <section className="border-t border-border/60 py-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          Actors
        </p>

        <h3 className="mt-1.5 text-lg font-semibold text-main">
          Where the journey opens up
        </h3>

        <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted">
          From the shared entry point, each actor follows a
          different path through the product.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {actors.map((actor) => {
            const isGenerating =
              generatingActorId === actor.id;

            const hasWorkflows = workflows.some(
              (workflow) => workflow.actor === actor.name,
            );

            return (
              <button
                key={actor.id}
                type="button"
                disabled={
                  isGenerating || isWorkflowsLoading
                }
                onClick={() =>
                  handleActorSelect(actor.id)
                }
                className="group flex min-h-[150px] flex-col rounded-lg border border-border bg-surface p-4 text-left transition-colors hover:border-brand/30 disabled:cursor-wait disabled:opacity-60"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-main">
                    {actor.name}
                  </p>

                  {hasWorkflows && (
                    <span className="text-[11px] font-medium text-muted">
                      Viewed
                    </span>
                  )}
                </div>

                {actor.description && (
                  <p className="mt-1.5 line-clamp-3 text-xs leading-5 text-muted">
                    {actor.description}
                  </p>
                )}

                <div className="mt-auto pt-4">
                  <span className="text-xs font-medium text-brand">
                    {isGenerating
                      ? "Generating..."
                      : hasWorkflows
                        ? "View workflow"
                        : "Generate workflow"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          {!allActorWorkflowsReady && (
            <p className="text-center text-xs text-muted">
              View the workflow for every actor to unlock the
              complete product flow.
            </p>
          )}

          <button
            type="button"
            disabled={isOpeningFullStructure}
            onClick={handleViewFullStructure}
            className="inline-flex items-center gap-2 rounded-lg border border-border/70 px-3 py-2 text-xs font-medium text-main transition-colors hover:border-brand/30 hover:text-brand disabled:cursor-wait disabled:opacity-60"
          >
            {isOpeningFullStructure
              ? "Loading project structure..."
              : "View full project structure"}

            {!isOpeningFullStructure && (
              <FiArrowRight className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </section>

      {publicFlow.length > 0 && (
        <section className="border-t border-border/50 py-8">
          <p className="text-sm font-medium text-main">
            Other entry points
          </p>

          <p className="mt-1 text-xs text-muted">
            Additional public areas identified in the
            product.
          </p>
        </section>
      )}
    </div>
  );
}