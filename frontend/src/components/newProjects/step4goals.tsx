
"use client";

import React, { useState } from "react";

import {
  FiArrowRight,
  FiCheck,
  FiPlus,
  FiX,
} from "react-icons/fi";

import { Button } from "../ui/button";

import { ActorGoal } from "@/types/project";

type Step4Props = {
  actorGoals: ActorGoal[];
  onBack: () => void;
  onContinue: () => void;
};

export default function Step4Goals({
  actorGoals,
  onBack,
  onContinue,
}: Step4Props) {
  const [selectedGoals, setSelectedGoals] = useState<
    Record<number, boolean>
  >(
    Object.fromEntries(
      actorGoals.map((goal) => [goal.id, true])
    )
  );

  const [customGoals, setCustomGoals] = useState<
    Record<string, string>
  >({});

  const [editingGoal, setEditingGoal] = useState<
    number | null
  >(null);

  const [editedGoals, setEditedGoals] = useState<
    Record<number, string>
  >({});

  const toggleGoal = (goalId: number) => {
    setSelectedGoals((prev) => ({
      ...prev,
      [goalId]: !prev[goalId],
    }));
  };

  const startEditing = (
    goalId: number,
    goal: string
  ) => {
    setEditingGoal(goalId);

    setEditedGoals((prev) => ({
      ...prev,
      [goalId]: goal,
    }));
  };

  const saveEdit = () => {
    setEditingGoal(null);
  };

  const handleCustomGoal = (
    actor: string,
    value: string
  ) => {
    setCustomGoals((prev) => ({
      ...prev,
      [actor]: value,
    }));
  };

  const addCustomGoal = (actor: string) => {
    const value = customGoals[actor]?.trim();

    if (!value) {
      return;
    }

    setCustomGoals((prev) => ({
      ...prev,
      [actor]: "",
    }));
  };

  const goalsByActor = actorGoals.reduce<
    Record<string, ActorGoal[]>
  >((groups, goal) => {
    if (!groups[goal.actor]) {
      groups[goal.actor] = [];
    }

    groups[goal.actor].push(goal);

    return groups;
  }, {});

  return (
    <div className="mx-auto max-w-3xl py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-main">
          What does each actor need to accomplish?
        </h1>

        <p className="mt-2 text-sm text-muted">
          We suggested the goals that matter most to the
          workflows. Keep, edit, or add anything that better
          represents your product.
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(goalsByActor).map(
          ([actorName, goals]) => (
            <div
              key={actorName}
              className="rounded-2xl border border-border bg-surface p-6 shadow-xs sm:p-8"
            >
              <div className="mb-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                  Actor
                </p>

                <h2 className="mt-1 text-lg font-bold text-main">
                  {actorName}
                </h2>
              </div>

              <div className="space-y-3">
                {goals.map((goal) => {
                  const selected =
                    selectedGoals[goal.id] ?? false;

                  const isEditing =
                    editingGoal === goal.id;

                  const displayedGoal =
                    editedGoals[goal.id] ?? goal.goal;

                  return (
                    <div
                      key={goal.id}
                      className={`rounded-xl border transition-all ${
                        selected
                          ? "border-brand bg-brand/[0.03]"
                          : "border-border bg-background"
                      }`}
                    >
                      <div className="flex items-start gap-3 p-4">
                        <button
                          type="button"
                          onClick={() =>
                            toggleGoal(goal.id)
                          }
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                            selected
                              ? "border-brand bg-brand"
                              : "border-muted"
                          }`}
                        >
                          {selected && (
                            <FiCheck className="h-3 w-3 text-white" />
                          )}
                        </button>

                        <div className="min-w-0 flex-1">
                          {isEditing ? (
                            <input
                              value={displayedGoal}
                              onChange={(event) =>
                                setEditedGoals((prev) => ({
                                  ...prev,
                                  [goal.id]:
                                    event.target.value,
                                }))
                              }
                              autoFocus
                              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-main focus:border-brand focus:outline-none"
                            />
                          ) : (
                            <p className="text-sm font-medium leading-relaxed text-main">
                              {displayedGoal}
                            </p>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              isEditing
                                ? saveEdit()
                                : startEditing(
                                    goal.id,
                                    displayedGoal
                                  )
                            }
                            className="mt-2 text-[11px] font-semibold text-muted hover:text-main"
                          >
                            {isEditing ? "Done" : "Edit"}
                          </button>
                        </div>

                        {!selected && (
                          <FiX className="h-4 w-4 shrink-0 text-muted" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 border-t border-border pt-5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted">
                  Add another goal
                </label>

                <div className="mt-2 flex gap-2">
                  <input
                    value={customGoals[actorName] ?? ""}
                    onChange={(event) =>
                      handleCustomGoal(
                        actorName,
                        event.target.value
                      )
                    }
                    placeholder={`What does ${actorName} need to accomplish?`}
                    className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm text-main placeholder:text-muted/60 focus:border-brand focus:outline-none"
                  />

                  <Button
                    type="button"
                    onClick={() =>
                      addCustomGoal(actorName)
                    }
                    className="rounded-xl border border-border bg-background px-4 text-main hover:bg-surface"
                  >
                    <FiPlus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )
        )}

        {actorGoals.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted">
              No goals have been suggested yet.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-semibold text-muted transition-colors hover:text-main"
        >
          Back
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-xs font-medium text-white transition-colors hover:bg-brand/90"
        >
          <span>Continue</span>
          <FiArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

