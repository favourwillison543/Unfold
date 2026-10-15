"use client";

import React, { useEffect, useState } from "react";

import { Question } from "@/types/project";

import { FiArrowRight } from "react-icons/fi";

import { Button } from "../ui/button";

import { useUpdateQuestions } from "@/hooks/useProject";

type Step3Props = {
  projectId: number;
  questions: Question[];
  onBack: () => void;
  onFinish: (answers: Record<string, string>) => void;
};

export default function Step3Questions({
  projectId,
  questions: initialQuestions,
  onBack,
  onFinish,
}: Step3Props) {
  const [questions, setQuestions] =
    useState<Question[]>(initialQuestions);

  const [currentIdx, setCurrentIdx] =
    useState(0);

  const [answers, setAnswers] =
    useState<Record<string, string>>({});

  const updateQuestions =
    useUpdateQuestions();

  useEffect(() => {
    setQuestions(initialQuestions);
  }, [initialQuestions]);

  const question = questions[currentIdx];

  const selectedAnswer = question
    ? answers[question.id] ?? ""
    : "";

  const handleSelect = (value: string) => {
    if (!question) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [question.id]: value,
    }));
  };

  const handleCustomAnswer = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (!question) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [question.id]: event.target.value,
    }));
  };

  const handleContinue = async () => {
    if (!question) {
      return;
    }
  
    const answer =
      answers[question.id]?.trim();
  
    if (!answer) {
      return;
    }
  
    try {
      const result =
        await updateQuestions.mutateAsync({
          projectId,
          questions: [
            {
              id: question.id,
              answer,
            },
          ],
        });
  
      const returnedQuestions =
        result?.questions ?? [];
  
      console.log(
        "QUESTION RESPONSE:",
        returnedQuestions
      );
  
      // Keep the latest questions returned by the backend.
      setQuestions(returnedQuestions);
  
      // Find the next question that has not been answered yet.
      const nextQuestion =
        returnedQuestions.find(
          (item) =>
            !item.answer &&
            item.id !== question.id
        );
  
      if (nextQuestion) {
        const nextIndex =
          returnedQuestions.findIndex(
            (item) =>
              item.id === nextQuestion.id
          );
  
        setCurrentIdx(nextIndex);
        return;
      }
  
      // There are no unanswered questions left.
      onFinish({
        ...answers,
        [question.id]: answer,
      });
    } catch (error) {
      console.error(
        "Failed to save question answer:",
        error
      );
    }
  };

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-3xl py-4">
        <div className="rounded-2xl border border-border bg-surface p-8 text-center">
          <h2 className="text-lg font-bold text-main">
            No questions found
          </h2>

          <p className="mt-2 text-sm text-muted">
            We didn't find any decisions that need
            clarification.
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-semibold text-muted transition-colors hover:text-main"
          >
            Back
          </button>

          <Button
            onClick={() => onFinish({})}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-xs font-medium text-white transition-colors hover:bg-brand/90"
          >
            <span>Continue</span>

            <FiArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (!question) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-main">
          Before we map your product...
        </h1>

        <p className="mt-2 text-sm text-muted">
          We found a few decisions that will
          significantly affect your workflows.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs sm:p-8">
        <div className="mb-6 flex items-center justify-between border-b border-border pb-6">
          <span className="rounded-md border border-border bg-background px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted">
            Question {currentIdx + 1} of{" "}
            {questions.length}
          </span>
        </div>

        <h2 className="text-lg font-bold text-main">
          {question.question}
        </h2>

        {question.reason && (
          <p className="mt-2 text-xs leading-relaxed text-muted">
            {question.reason}
          </p>
        )}

        <div className="mt-6 space-y-3">
          {question.options.map(
            (option) => {
              const selected =
                selectedAnswer ===
                option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    handleSelect(
                      option.value
                    )
                  }
                  className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                    selected
                      ? "border-brand bg-brand/[0.03] ring-1 ring-brand"
                      : "border-border bg-background hover:border-border/80"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      selected
                        ? "border-brand bg-brand"
                        : "border-muted"
                    }`}
                  >
                    {selected && (
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </div>

                  <p className="text-xs font-bold text-main">
                    {option.label}
                  </p>
                </button>
              );
            }
          )}
        </div>

        <div className="mt-6 border-t border-border pt-6">
          <label className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Something else?
          </label>

          <p className="mb-3 mt-1 text-xs text-muted">
            Don't see the option you want? Describe
            your preferred approach.
          </p>

          <textarea
            value={
              question.options.some(
                (option) =>
                  option.value ===
                  selectedAnswer
              )
                ? ""
                : selectedAnswer
            }
            onChange={
              handleCustomAnswer
            }
            placeholder="Describe your answer..."
            rows={3}
            className="w-full resize-none rounded-xl border border-border bg-background p-4 text-sm text-main transition-colors placeholder:text-muted/60 focus:border-brand focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={
            updateQuestions.isPending
          }
          className="text-xs font-semibold text-muted transition-colors hover:text-main disabled:opacity-50"
        >
          Back
        </button>

        <Button
          onClick={handleContinue}
          disabled={
            !selectedAnswer.trim() ||
            updateQuestions.isPending
          }
          className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-xs font-medium text-white transition-colors hover:bg-brand/90 disabled:opacity-50"
        >
          <span>
            {updateQuestions.isPending
              ? "Saving..."
              : "Continue"}
          </span>

          {!updateQuestions.isPending && (
            <FiArrowRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {updateQuestions.isError && (
        <p className="mt-4 text-center text-xs text-red-500">
          We couldn't save your answer. Please try
          again.
        </p>
      )}
    </div>
  );
}