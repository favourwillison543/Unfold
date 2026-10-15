"use client";

import {
  FiAlertCircle,
  FiCheckCircle,
  FiLoader,
  FiRefreshCw,
  FiUsers,
  FiGitBranch,
  FiHelpCircle,
} from "react-icons/fi";

import { useQueryClient } from "@tanstack/react-query";

import {
  useGenerateChallenges,
  useProjectChallenges,
} from "@/hooks/useChallenge";

import { Analysis } from "@/types/project";
import { Button } from "@/components/ui/button";

type ChallengesTabProps = {
  analysis: Analysis;
  projectId: number;
};

export default function ChallengesTab({
  analysis,
  projectId,
}: ChallengesTabProps) {
  const queryClient = useQueryClient();

  const {
    data: challenges = [],
    isLoading,
    isError,
  } = useProjectChallenges(projectId);

  const generateChallenges = useGenerateChallenges();

  const handleGenerateChallenges = () => {
    generateChallenges.mutate(projectId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["project-challenges", projectId],
        });
      },
    });
  };

  const isGenerating = generateChallenges.isPending;

  const unansweredQuestions = analysis.questions.filter(
    (question) => !question.answer,
  ).length;

  const getSeverity = (severity: string) => {
    switch (severity) {
      case "critical":
        return {
          label: "Critical",
          className: "text-red-600",
        };

      case "important":
        return {
          label: "Important",
          className: "text-amber-600",
        };

      default:
        return {
          label: "Consider",
          className: "text-muted",
        };
    }
  };

  return (
    <div className="mt-6 space-y-10 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-6 border-b border-border/60 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-5">
          {/* Header illustration */}
          <div className="relative hidden h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-border bg-[#F7F3EF] sm:flex">
            <div className="absolute -right-5 -top-5 h-14 w-14 rounded-full bg-brand/10" />

            <div className="absolute -bottom-5 -left-3 h-16 w-16 rounded-full border border-brand/15" />

            <div className="absolute left-5 top-5 h-9 w-10 rotate-[-6deg] rounded-md border border-brand/35 bg-white/70">
              <div className="absolute left-2 top-2 h-1 w-5 rounded-full bg-brand/35" />
              <div className="absolute left-2 top-5 h-1 w-6 rounded-full bg-brand/15" />
            </div>

            <div className="absolute left-[27px] top-[32px] h-1.5 w-1.5 rounded-full bg-brand" />
            <div className="absolute left-[37px] top-[28px] h-1.5 w-1.5 rounded-full bg-brand/40" />
            <div className="absolute left-[34px] top-[39px] h-1.5 w-1.5 rounded-full bg-brand/60" />
          </div>

          <div>
            <h2 className="text-xl font-semibold tracking-tight text-main">
              Challenges
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
              Gaps, contradictions, and product decisions that may
              affect how the product should work.
            </p>
          </div>
        </div>

        {/* Examine button */}
        <Button
          type="button"
          onClick={handleGenerateChallenges}
          disabled={isGenerating}
          className="h-10 shrink-0 gap-2 rounded-lg bg-deep px-4 text-sm font-medium text-white hover:bg-deep/90"
        >
          {isGenerating ? (
            <>
              <FiLoader className="h-4 w-4 animate-spin" />
              Examining...
            </>
          ) : (
            <>
              <FiRefreshCw className="h-4 w-4" />
              {challenges.length > 0
                ? "Re-examine product"
                : "Examine product"}
            </>
          )}
        </Button>
      </div>

      {/* Generation error */}
      {generateChallenges.isError && (
        <div className="border-b border-border/60 pb-7">
          <div className="flex items-start gap-3">
            <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />

            <div>
              <p className="text-sm font-semibold text-main">
                Challenge analysis could not be completed.
              </p>

              <p className="mt-1 text-xs leading-5 text-muted">
                Check the connection and try examining the product
                again.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <section>
          <div className="flex items-center gap-3 border-b border-border/60 py-8">
            <FiLoader className="h-4 w-4 animate-spin text-brand" />

            <p className="text-sm text-muted">
              Loading challenges...
            </p>
          </div>
        </section>
      )}

      {/* Fetch error */}
      {isError && !isLoading && (
        <section>
          <div className="flex items-start gap-3 border-b border-border/60 pb-7">
            <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />

            <div>
              <p className="text-sm font-semibold text-main">
                Challenges could not be loaded.
              </p>

              <p className="mt-1 max-w-xl text-xs leading-5 text-muted">
                There was a problem retrieving the challenges for
                this project.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Challenges */}
      {!isLoading && !isError && challenges.length > 0 && (
        <section>
          <div className="border-border/60">
            {challenges.map((challenge, index) => {
              const severity = getSeverity(
                challenge.severity,
              );

              return (
                <div
                  key={challenge.id}
                  className="group border-b border-border/60 py-8 first:pt-0 last:border-b-0"
                >
                  <div className="grid grid-cols-[36px_minmax(0,1fr)] gap-4 sm:grid-cols-[52px_minmax(0,1fr)_110px] sm:gap-6">
                    {/* Number */}
                    <div className="pt-0.5">
                      <span
                        className={`text-sm font-bold tabular-nums ${
                          challenge.resolved
                            ? "text-muted"
                            : "text-brand"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Main content */}
                    <div className="min-w-0">
                      {/* Title */}
                      <div className="max-w-3xl">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3
                            className={`text-sm font-bold leading-6 ${
                              challenge.resolved
                                ? "text-muted"
                                : "text-main"
                            }`}
                          >
                            {challenge.title}
                          </h3>

                          {challenge.resolved && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                              <FiCheckCircle className="h-3.5 w-3.5" />
                              Resolved
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p className="mt-2.5 max-w-3xl text-sm leading-6 text-muted">
                          {challenge.description}
                        </p>
                      </div>

                      {/* Context */}
                      {(challenge.relatedActor ||
                        challenge.relatedWorkflow) && (
                        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                          {challenge.relatedActor && (
                            <div className="flex items-center gap-2 text-xs text-muted">
                              <FiUsers className="h-3.5 w-3.5" />

                              <span>
                                <span className="text-muted/70">
                                  Actor
                                </span>{" "}
                                <span className="font-medium text-main">
                                  {challenge.relatedActor}
                                </span>
                              </span>
                            </div>
                          )}

                          {challenge.relatedWorkflow && (
                            <div className="flex items-center gap-2 text-xs text-muted">
                              <FiGitBranch className="h-3.5 w-3.5" />

                              <span>
                                <span className="text-muted/70">
                                  Workflow
                                </span>{" "}
                                <span className="font-medium text-main">
                                  {challenge.relatedWorkflow}
                                </span>
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Question */}
                      {challenge.suggestedQuestion && (
                        <div className="mt-6 max-w-3xl border-l-2 border-brand/20 pl-4">
                          <div className="flex items-center gap-2">
                            <FiHelpCircle className="h-3.5 w-3.5 text-brand" />

                            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                              Question to resolve
                            </p>
                          </div>

                          <p className="mt-1.5 text-sm font-medium leading-6 text-main">
                            {challenge.suggestedQuestion}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Severity */}
                    <div className="hidden justify-end pt-0.5 sm:flex">
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-[0.08em] ${severity.className}`}
                      >
                        {severity.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Empty state */}
      {!isLoading && !isError && challenges.length === 0 && (
        <section>
          <div className="relative overflow-hidden border border-dashed border-border py-16">
            <div className="mx-auto flex max-w-sm flex-col items-center text-center">
              {/* Empty illustration */}
              <div className="relative mb-6 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-border bg-[#F7F3EF]">
                <div className="absolute -right-5 -top-5 h-14 w-14 rounded-full bg-brand/10" />

                <div className="absolute -bottom-6 -left-2 h-16 w-16 rounded-full border border-brand/15" />

                <div className="relative h-9 w-12 rotate-[-5deg] rounded-md border border-brand/35 bg-white/70">
                  <div className="absolute left-2 top-2 h-1 w-5 rounded-full bg-brand/30" />
                  <div className="absolute left-2 top-5 h-1 w-7 rounded-full bg-brand/15" />
                </div>
              </div>

              <h3 className="text-sm font-semibold text-main">
                No challenges identified yet
              </h3>

              <p className="mt-2 max-w-xs text-xs leading-5 text-muted">
                Examine the product to look across its actors,
                goals, questions, entities, and workflows for
                potential gaps or contradictions.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Examination context */}
      {!isLoading && !isError && (
        <section>
          <div className="border-b border-border/60 pb-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-main">
                  Examination context
                </h3>

                <p className="mt-1 text-xs leading-5 text-muted">
                  The current product model available to the
                  challenge analysis.
                </p>
              </div>

              <span className="text-[10px] font-medium text-muted">
                {[
                  analysis.people.length > 0
                    ? `${analysis.people.length} actors`
                    : null,
                  analysis.entities.length > 0
                    ? `${analysis.entities.length} entities`
                    : null,
                  analysis.relationships.length > 0
                    ? `${analysis.relationships.length} relationships`
                    : null,
                  analysis.questions.length > 0
                    ? `${unansweredQuestions} open questions`
                    : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </div>
          </div>

          <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
            <ContextItem
              label="Actors"
              value={analysis.people.length}
            />

            <ContextItem
              label="Entities"
              value={analysis.entities.length}
            />

            <ContextItem
              label="Relationships"
              value={analysis.relationships.length}
            />

            <ContextItem
              label="Open questions"
              value={unansweredQuestions}
            />
          </div>
        </section>
      )}
    </div>
  );
}

function ContextItem({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="border-b border-border/60 px-0 py-5 first:pl-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0 lg:py-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
        {label}
      </p>

      <p className="mt-2 text-xl font-semibold tracking-tight text-main">
        {value}
      </p>
    </div>
  );
}