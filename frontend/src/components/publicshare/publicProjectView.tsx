"use client";

import Link from "next/link";
import { useState } from "react";
import type { ComponentProps } from "react";

import { FiArrowRight, FiGitBranch } from "react-icons/fi";

import { Container } from "@/components/ui/container";

import PublicProjectTabs from "@/components/publicshare/publicProjectTabs";
import PublicOverview from "@/components/publicshare/publicOverview";
import PublicPeople from "@/components/publicshare/publicPeople";
import PublicQuestions from "@/components/publicshare/publicQuestions";
import PublicChallenges from "@/components/publicshare/publicChallenges";

import LoadingScreen from "@/components/ui/LoadingScreen";
import { usePublicProject } from "@/hooks/usePublicSharing";

import PublicHeader from "./PublicHeader";

type ActiveTab =
  | "overview"
  | "people"
  | "questions"
  | "workflows"
  | "challenges";

type PublicProjectViewProps = {
  token: string;
};

type OverviewAnalysis = NonNullable<
  ComponentProps<typeof PublicOverview>["analysis"]
>;

type OverviewProject = ComponentProps<
  typeof PublicOverview
>["project"];

type People = ComponentProps<
  typeof PublicPeople
>["people"];

type Questions = ComponentProps<
  typeof PublicQuestions
>["questions"];

type Challenges = ComponentProps<
  typeof PublicChallenges
>["challenges"];

type PublicApiProject = {
  project: OverviewProject;

  analysis: {
    id: number;
    understanding: string | null;

    productModel: {
      role: string;
      directCustomer: string;
      usageMode: string;
      primaryInterfaces: string[];
    } | null;

    productTypes: unknown[];
    productAreas: unknown[];
    people: unknown[];
    questions: Array<{
      id?: number | string;
      question?: string;
      reason?: string | null;
      answer?: string | null;
      options?: Array<{
        value: string;
        label: string;
      }>;
    }>;
    actorGoals: Array<{
      id: number;
      actor: string;
      goal: string;
    }>;
    entities: Array<{
      id: number;
      name: string;
      description: string | null;
    }>;
    relationships: Array<{
      id: number;
      from: string;
      to: string;
      relationship: string;
    }>;
  } | null;

  workflows: Array<{
    id: number;
    name: string;
    description: string | null;
    actor: string;
    goal: string;
    entryPoint: string | null;
    completion: string | null;

    steps?: Array<{
      id: number;
      title: string;
      type: string;
      actor: string | null;
      page: string | null;
      description: string | null;
      stepOrder: number;
    }>;

    pages?: unknown[];
    connections?: unknown[];
  }>;

  challenges: Challenges;
};

export default function PublicProjectView({
  token,
}: PublicProjectViewProps) {
  const [activeTab, setActiveTab] =
    useState<ActiveTab>("overview");

  const {
    data,
    isLoading,
    isError,
  } = usePublicProject(token) as {
    data: PublicApiProject | undefined;
    isLoading: boolean;
    isError: boolean;
  };

  if (isLoading) {
    return (
      <>
        <PublicHeader />

        <div className="w-full pb-16 pt-16">
          <Container>
            <LoadingScreen />
          </Container>
        </div>
      </>
    );
  }

  if (isError || !data) {
    return (
      <>
        <PublicHeader />

        <div className="w-full pb-16 pt-16">
          <Container>
            <div className="py-16">
              <p className="text-sm text-neutral-500">
                This shared project could not be found.
              </p>
            </div>
          </Container>
        </div>
      </>
    );
  }

  const {
    project,
    analysis,
    workflows,
    challenges,
  } = data;

  /*
   * PublicOverview and PublicQuestions intentionally consume
   * different question shapes.
   *
   * PublicOverview only needs:
   * id, question, answer
   *
   * PublicQuestions needs:
   * id, question, reason, answer, options
   */

  const questionsForOverview: OverviewAnalysis["questions"] =
    (analysis?.questions ?? []).map((question) => ({
      id:
        typeof question.id === "number"
          ? question.id
          : undefined,

      question: question.question,

      answer: question.answer ?? null,
    }));

  const questionsForQuestions: Questions =
    (analysis?.questions ?? []).map((question, index) => ({
      id:
        question.id ??
        index,

      question: question.question ?? "",

      reason: question.reason ?? null,

      answer: question.answer ?? null,

      options: question.options ?? [],
    }));

  /*
   * PublicPeople has its own PublicPerson type.
   * The API already returns the person objects in the shape
   * expected by that component, so we use the component's
   * actual prop type instead of creating another PublicPerson.
   */
  const peopleForPeople: People =
    (analysis?.people ?? []) as People;

  /*
   * PublicOverview accepts its own exact analysis shape.
   * Build it separately rather than passing the API object
   * directly, because its question shape is intentionally
   * smaller than PublicQuestions.
   */
  const overviewAnalysis: OverviewAnalysis | null =
    analysis
      ? {
          id: analysis.id,

          understanding: analysis.understanding,

          productModel: analysis.productModel,

          productTypes: analysis.productTypes,

          productAreas: analysis.productAreas,

          people: analysis.people,

          questions: questionsForOverview,

          actorGoals: analysis.actorGoals,

          entities: analysis.entities,

          relationships: analysis.relationships,
        }
      : null;

  return (
    <>
      <PublicHeader />

      <div className="w-full pb-16 pt-16">
        <Container>
          {/* Breadcrumbs */}
          <div className="mb-6 flex items-center gap-2 text-sm text-neutral-500">
            <span>Shared project</span>

            <span>/</span>

            <span className="text-neutral-900">
              {project.name}
            </span>
          </div>

          {/* Header */}
          <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-start">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
                {project.name}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500 line-clamp-4">
                {project.description ||
                  "No description provided."}
              </p>
            </div>

            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-[#C65D3A] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#b65232]"
            >
              Create your own project
              <FiArrowRight size={15} />
            </Link>
          </div>

          {/* Tabs */}
          <PublicProjectTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            questionCount={questionsForQuestions.length}
          />

          {/* Overview */}
          {activeTab === "overview" && (
            <PublicOverview
              project={project}
              analysis={overviewAnalysis}
            />
          )}

          {/* People */}
          {activeTab === "people" && (
            <PublicPeople
              people={peopleForPeople}
            />
          )}

          {/* Questions */}
          {activeTab === "questions" && (
            <PublicQuestions
              questions={questionsForQuestions}
            />
          )}

          {/* Workflows */}
          {activeTab === "workflows" && (
            <div className="mt-6 pb-16">
              {/* Header */}
              <div className="border-b border-border/60 pb-7">
                <h2 className="text-xl font-semibold tracking-tight text-main">
                  Workflows
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                  Follow the product from its shared entry
                  point into the experiences each actor needs.
                </p>
              </div>

              {/* Product structure */}
              <section className="py-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Product structure
                </p>

                <h3 className="mt-1.5 text-lg font-semibold text-main">
                  How the product is structured
                </h3>

                <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted">
                  The product begins with shared entry points
                  before branching into the different actors
                  and their workflows.
                </p>

                {/* Actors */}
                {peopleForPeople.length > 0 ? (
                  <div className="mt-6">
                    <p className="mb-3 text-xs font-medium text-muted">
                      Actors
                    </p>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {peopleForPeople.map((person: any) => {
                        const actorWorkflowCount =
                          workflows.filter(
                            (workflow) =>
                              workflow.actor === person.name,
                          ).length;

                        return (
                          <div
                            key={person.id}
                            className="flex min-h-[150px] flex-col rounded-lg border border-border bg-surface p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-main">
                                  {person.name}
                                </p>

                                {person.type && (
                                  <p className="mt-0.5 text-[10px] font-medium text-muted">
                                    {person.type}
                                  </p>
                                )}
                              </div>

                              {actorWorkflowCount > 0 && (
                                <span className="shrink-0 text-[10px] font-medium text-muted">
                                  {actorWorkflowCount}{" "}
                                  {actorWorkflowCount === 1
                                    ? "workflow"
                                    : "workflows"}
                                </span>
                              )}
                            </div>

                            {person.description && (
                              <p className="mt-2 line-clamp-3 text-xs leading-5 text-muted">
                                {person.description}
                              </p>
                            )}

                            <div className="mt-auto flex items-center gap-1.5 pt-5 text-[11px] font-medium text-muted">
                              <FiGitBranch className="h-3.5 w-3.5" />

                              <span>
                                Part of the product flow
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 border border-dashed border-border py-10 text-center">
                    <p className="text-sm font-medium text-main">
                      No actors identified yet
                    </p>

                    <p className="mt-1.5 text-xs leading-5 text-muted">
                      The product structure does not have any
                      identified actors yet.
                    </p>
                  </div>
                )}
              </section>

              {/* Full structure */}
              <section className="border-t border-border/60 py-8">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand/20 bg-brand/5 text-brand">
                    <FiGitBranch className="h-4 w-4" />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-main">
                    Full project structure
                  </h3>

                  <p className="mt-1.5 max-w-md text-xs leading-5 text-muted">
                    Explore the complete product flow, actors,
                    workflow steps, pages, and connections.
                  </p>

                  <Link
                    href={`/share/${token}/workflows`}
                    className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border/70 px-4 py-2 text-xs font-medium text-main transition-colors hover:border-brand/30 hover:text-brand"
                  >
                    View full project structure
                    <FiArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </section>
            </div>
          )}

          {/* Challenges */}
          {activeTab === "challenges" && (
            <PublicChallenges
              challenges={challenges}
            />
          )}
        </Container>
      </div>
    </>
  );
}