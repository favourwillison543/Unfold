"use client";

import Link from "next/link";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiCircle,
  FiGitBranch,
} from "react-icons/fi";

import { usePublicProject } from "@/hooks/usePublicSharing";
import LoadingScreen from "@/components/ui/LoadingScreen";

type PublicWorkflowViewProps = {
  token: string;
  workflowId: number;
};

type WorkflowStep = {
  id: number;
  title: string;
  type: string;
  actor: string | null;
  page: string | null;
  description: string | null;
  stepOrder: number;
};

type WorkflowPage = {
  id: number;
  name?: string;
  title?: string;
  [key: string]: unknown;
};

type WorkflowConnection = {
  id: number;
  fromStepId?: number;
  toStepId?: number;
  [key: string]: unknown;
};

type PublicWorkflow = {
  id: number;
  name: string;
  description: string | null;
  actor: string;
  goal: string;
  entryPoint: string | null;
  completion: string | null;
  steps: WorkflowStep[];
  pages?: WorkflowPage[];
  connections?: WorkflowConnection[];
};

type PublicProjectResponse = {
  project: {
    id: number;
    name: string;
    description: string | null;
    productFormat: string;
  };

  workflows: PublicWorkflow[];
};

export default function PublicWorkflowView({
  token,
  workflowId,
}: PublicWorkflowViewProps) {
  const {
    data,
    isLoading,
    isError,
  } = usePublicProject(token) as {
    data: PublicProjectResponse | undefined;
    isLoading: boolean;
    isError: boolean;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFDFB]">
        <LoadingScreen />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFDFB] px-6">
        <div className="max-w-md text-center">
          <p className="text-sm font-medium text-neutral-900">
            This project is unavailable
          </p>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            The public link may have been disabled or may no
            longer exist.
          </p>
        </div>
      </div>
    );
  }

  const workflow = data.workflows.find(
    (item) => item.id === workflowId,
  );

  if (!workflow) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFDFB] px-6">
        <div className="max-w-md text-center">
          <p className="text-sm font-medium text-neutral-900">
            Workflow not found
          </p>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            This workflow is not available through this public
            project link.
          </p>

          <Link
            href={`/share/${token}`}
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#C65D3A] hover:underline"
          >
            <FiArrowLeft size={15} />
            Back to project
          </Link>
        </div>
      </div>
    );
  }

  const steps = [...(workflow.steps ?? [])].sort(
    (a, b) => a.stepOrder - b.stepOrder,
  );

  return (
    <div className="min-h-screen bg-[#FFFDFB] text-neutral-900">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href={`/share/${token}`}
            className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900"
          >
            <FiArrowLeft size={16} />
            {data.project.name}
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Read-only
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-20">
        {/* Workflow header */}
        <section className="border-b border-neutral-200 py-10">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">
              Workflow
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
              {workflow.name}
            </h1>

            {workflow.description && (
              <p className="mt-4 text-sm leading-7 text-neutral-500">
                {workflow.description}
              </p>
            )}
          </div>

          <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-neutral-200 bg-neutral-200 md:grid-cols-3">
            <div className="bg-white p-5">
              <p className="text-xs font-medium text-neutral-400">
                Actor
              </p>

              <p className="mt-2 text-sm font-medium text-neutral-900">
                {workflow.actor || "Not specified"}
              </p>
            </div>

            <div className="bg-white p-5">
              <p className="text-xs font-medium text-neutral-400">
                Goal
              </p>

              <p className="mt-2 text-sm font-medium text-neutral-900">
                {workflow.goal || "Not specified"}
              </p>
            </div>

            <div className="bg-white p-5">
              <p className="text-xs font-medium text-neutral-400">
                Steps
              </p>

              <p className="mt-2 text-sm font-medium text-neutral-900">
                {steps.length}
              </p>
            </div>
          </div>
        </section>

        {/* Entry and completion */}
        {(workflow.entryPoint ||
          workflow.completion) && (
          <section className="border-b border-neutral-200 py-8">
            <div className="grid gap-4 md:grid-cols-2">
              {workflow.entryPoint && (
                <div className="rounded-xl border border-neutral-200 bg-white p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-400">
                    Entry point
                  </p>

                  <p className="mt-3 text-sm leading-6 text-neutral-700">
                    {workflow.entryPoint}
                  </p>
                </div>
              )}

              {workflow.completion && (
                <div className="rounded-xl border border-neutral-200 bg-white p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-400">
                    Completion
                  </p>

                  <p className="mt-3 text-sm leading-6 text-neutral-700">
                    {workflow.completion}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Workflow steps */}
        <section className="py-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">
              Flow
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-900">
              Workflow steps
            </h2>
          </div>

          {steps.length > 0 ? (
            <div className="relative mt-8">
              <div className="absolute bottom-6 left-[19px] top-6 w-px bg-neutral-200" />

              <div className="space-y-5">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="relative flex gap-5"
                  >
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-[#FFFDFB] text-xs font-semibold text-neutral-500">
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1 rounded-xl border border-neutral-200 bg-white p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold text-neutral-900">
                            {step.title}
                          </h3>

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            {step.type && (
                              <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] font-medium capitalize text-neutral-500">
                                {step.type}
                              </span>
                            )}

                            {step.actor && (
                              <span className="text-xs text-neutral-400">
                                {step.actor}
                              </span>
                            )}
                          </div>
                        </div>

                        {step.type === "success" ? (
                          <FiCheckCircle
                            size={17}
                            className="text-emerald-600"
                          />
                        ) : step.type === "decision" ? (
                          <FiGitBranch
                            size={17}
                            className="text-neutral-400"
                          />
                        ) : (
                          <FiCircle
                            size={17}
                            className="text-neutral-300"
                          />
                        )}
                      </div>

                      {step.description && (
                        <p className="mt-4 text-sm leading-6 text-neutral-500">
                          {step.description}
                        </p>
                      )}

                      {step.page && (
                        <div className="mt-4 border-t border-neutral-100 pt-3">
                          <p className="text-xs text-neutral-400">
                            Page
                          </p>

                          <p className="mt-1 text-xs font-medium text-neutral-700">
                            {step.page}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-neutral-200 bg-white px-5 py-8 text-sm text-neutral-400">
              No workflow steps have been created yet.
            </div>
          )}
        </section>

        {/* Pages */}
        {workflow.pages &&
          workflow.pages.length > 0 && (
            <section className="border-t border-neutral-200 py-10">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">
                Pages
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-900">
                Workflow pages
              </h2>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {workflow.pages.map((page, index) => (
                  <div
                    key={page.id ?? index}
                    className="rounded-xl border border-neutral-200 bg-white p-5"
                  >
                    <p className="text-sm font-medium text-neutral-900">
                      {page.name ||
                        page.title ||
                        `Page ${index + 1}`}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

        {/* Connections summary */}
        {workflow.connections &&
          workflow.connections.length > 0 && (
            <section className="border-t border-neutral-200 py-10">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">
                Logic
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-900">
                Workflow connections
              </h2>

              <p className="mt-2 text-sm leading-6 text-neutral-500">
                This workflow contains{" "}
                {workflow.connections.length}{" "}
                {workflow.connections.length === 1
                  ? "connection"
                  : "connections"}{" "}
                between its steps.
              </p>
            </section>
          )}
      </main>
    </div>
  );
}