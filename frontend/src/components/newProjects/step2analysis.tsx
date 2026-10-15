"use client";

import React, { useState } from "react";

import {
  FiEdit2,
  FiPlus,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";

import { Button } from "../ui/button";

import { FaWandMagicSparkles } from "react-icons/fa6";

import EditModal from "./editmodal";

type Step2Props = {
  understanding: string;
  types: string[];
  setTypes: (val: string[]) => void;
  actors: string[];
  setActors: (val: string[]) => void;
  areas: string[];
  setAreas: (val: string[]) => void;
  onBack: () => void;
  onNext: () => void;
  isLoading?: boolean;
};

export default function Step2Analysis({
  understanding,
  types,
  setTypes,
  actors,
  setActors,
  areas,
  setAreas,
  onBack,
  onNext,
  isLoading = false,
}: Step2Props) {
  const [activeModal, setActiveModal] = useState<
    "types" | "actors" | "areas" | null
  >(null);

  return (
    <div className="mx-auto max-w-3xl py-4">
      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-main"
      >
        <FiArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </button>

      {/* Header Tag */}
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand">
        <FaWandMagicSparkles className="h-3.5 w-3.5" />
        <span>Analysis Complete</span>
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-main">
        Here's what we understand
      </h1>

      <p className="mt-2 text-sm text-muted">
        Review our interpretation before we build your workflows.
        We've extracted the core architecture based on your initial
        prompt.
      </p>

      <div className="mt-8 space-y-5">
        {/* What We Understand */}
        <div className="mt-8 rounded-2xl border border-border bg-surface p-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
            What we understand
          </span>

          <p className="mt-3 text-sm leading-relaxed text-main">
            {understanding}
          </p>
        </div>

        {/* Product Type & Actors */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Product Type */}
          <div className="group relative rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-brand/40">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                Product Type
              </span>

              <button
                type="button"
                onClick={() => setActiveModal("types")}
                className="rounded-lg p-1.5 text-muted transition-colors hover:text-brand"
                aria-label="Edit product types"
              >
                <FiEdit2 className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {types.map((item, idx) => (
                <span
                  key={idx}
                  className="text-xs font-bold uppercase tracking-wider text-main"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Actors */}
          <div className="group relative rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-brand/40">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                Actors
              </span>

              <button
                type="button"
                onClick={() => setActiveModal("actors")}
                className="rounded-lg p-1.5 text-muted transition-colors hover:text-brand"
                aria-label="Edit actors"
              >
                <FiEdit2 className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {actors.map((item, idx) => (
                <span
                  key={idx}
                  className="text-xs font-bold uppercase tracking-wider text-main"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Product Areas */}
        <div className="relative rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-brand/40">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
              Product Areas
            </span>

            <button
              type="button"
              onClick={() => setActiveModal("areas")}
              className="rounded-lg p-1.5 text-muted transition-colors hover:text-brand"
              aria-label="Edit product areas"
            >
              <FiEdit2 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {areas.map((item, idx) => (
              <span
                key={idx}
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-main"
              >
                {item}
              </span>
            ))}

            <button
              type="button"
              onClick={() => setActiveModal("areas")}
              className="inline-flex items-center gap-1 rounded-lg border border-dashed border-border px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-brand/50 hover:text-brand"
            >
              <FiPlus className="h-3.5 w-3.5" />
              <span>Add Area</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
        <p className="text-sm font-semibold text-main">
          Does this look right?
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveModal("areas")}
            className="rounded-full border border-border bg-surface px-5 py-2.5 text-xs font-semibold text-main transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          >
            Make changes
          </button>

          <Button
            onClick={onNext}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-xs font-medium text-white transition-colors hover:bg-brand/90 disabled:opacity-50"
          >
            <span>
              {isLoading ? "Generating..." : "Looks good"}
            </span>

            <FiArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Modals */}
      <EditModal
        isOpen={activeModal === "types"}
        title="Product Types"
        items={types}
        onClose={() => setActiveModal(null)}
        onSave={(updated) => {
          setTypes(updated);
          setActiveModal(null);
        }}
      />

      <EditModal
        isOpen={activeModal === "actors"}
        title="Actors"
        items={actors}
        onClose={() => setActiveModal(null)}
        onSave={(updated) => {
          setActors(updated);
          setActiveModal(null);
        }}
      />

      <EditModal
        isOpen={activeModal === "areas"}
        title="Product Areas"
        items={areas}
        onClose={() => setActiveModal(null)}
        onSave={(updated) => {
          setAreas(updated);
          setActiveModal(null);
        }}
      />
    </div>
  );
}