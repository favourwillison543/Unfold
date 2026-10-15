"use client";

import React, { useEffect, useRef, useState } from "react";

import { FiArrowRight, FiCheck, FiLoader } from "react-icons/fi";

import { useGenerateStructure } from "@/hooks/useWorkflow";

type Step5Props = {
  projectId: number;
  onComplete: () => void;
};

export default function Step5Generation({
  projectId,
  onComplete,
}: Step5Props) {
  const [status, setStatus] = useState<
    "generating" | "complete" | "error"
  >("generating");

  const [actorCount, setActorCount] = useState(0);

  const generateStructure = useGenerateStructure();

  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) {
      return;
    }

    hasStarted.current = true;

    const generate = async () => {
      try {
        setStatus("generating");

        // Generate the initial product structure:
        // public flow + actors + actor pages + capabilities.
        //
        // Detailed workflows are generated later,
        // per actor, from the Workflows tab.

        const structure =
          await generateStructure.mutateAsync(projectId);

        setActorCount(structure.actors.length);

        setStatus("complete");
      } catch (error) {
        console.error(
          "Failed to generate project model:",
          error,
        );

        setStatus("error");
      }
    };

    generate();
  }, [projectId, generateStructure]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center py-10">
      <div className="w-full text-center">
        {/* Status icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-brand/20 bg-brand/[0.06] text-brand">
          {status === "generating" && (
            <FiLoader className="h-5 w-5 animate-spin" />
          )}

          {status === "complete" && (
            <FiCheck className="h-5 w-5" />
          )}

          {status === "error" && (
            <span className="text-sm font-semibold">
              !
            </span>
          )}
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-main">
          {status === "generating" &&
            "Building your product model..."}

          {status === "complete" &&
            "Your product model is ready"}

          {status === "error" &&
            "Something went wrong"}
        </h1>

        {/* Description */}
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
          {status === "generating" &&
            "We're mapping the people involved in your product and the important areas they interact with."}

          {status === "complete" &&
            "UnFold has mapped the important parts of your product. Open an actor in the Workflows tab to generate their detailed flow."}

          {status === "error" &&
            "We couldn't finish building your product model. Please try again."}
        </p>

        {/* Generation summary */}
        {status === "complete" && (
          <>
            <div className="mx-auto mt-8 max-w-sm">
              <div className="rounded-xl border border-border bg-surface px-5 py-4 text-left">
                <p className="text-2xl font-semibold text-main">
                  {actorCount}
                </p>

                <p className="mt-1 text-xs text-muted">
                  Actors
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onComplete}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand/90"
            >
              Explore your product

              <FiArrowRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Error */}
        {status === "error" && (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-full bg-brand px-6 py-2.5 text-xs font-medium text-white transition-colors hover:bg-brand/90"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}