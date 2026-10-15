"use client";

import React from "react";

import { useRouter } from "next/navigation";

import {
  FiArrowLeft,
  FiArrowRight,
  FiInfo,
} from "react-icons/fi";

import { Button } from "../ui/button";

type Step1Props = {
  productName: string;
  setProductName: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  productFormat: string;
  setProductFormat: (val: string) => void;
  onNext: () => void;
  isLoading?: boolean;
};

const PRODUCT_FORMATS = [
  {
    value: "web_app",
    label: "Web app",
    description:
      "A browser-based application with screens, users, and flows.",
  },
  {
    value: "mobile_app",
    label: "Mobile app",
    description:
      "An application designed primarily for mobile devices.",
  },
  {
    value: "saas_platform",
    label: "SaaS / Platform",
    description:
      "Software people use through accounts, workspaces, or subscriptions.",
  },
  {
    value: "marketplace",
    label: "Marketplace",
    description:
      "Connects different groups of people to exchange products or services.",
  },
  {
    value: "infrastructure",
    label: "Infrastructure / API",
    description:
      "APIs, payments, data systems, or developer infrastructure.",
  },
  {
    value: "workflow_automation",
    label: "Workflow / Automation",
    description:
      "Automates or improves a process involving multiple steps.",
  },
  {
    value: "business_tool",
    label: "Business tool",
    description:
      "Software built to help a team or organization operate.",
  },
  {
    value: "community_social",
    label: "Community / Social",
    description:
      "Built around people, interaction, or communities.",
  },
  {
    value: "other",
    label: "Other",
    description:
      "Something that doesn't fit the categories above.",
  },
];

export default function Step1Idea({
  productName,
  setProductName,
  description,
  setDescription,
  productFormat,
  setProductFormat,
  onNext,
  isLoading = false,
}: Step1Props) {
  const router = useRouter();

  const handleBack = () => {
    router.push("/project/new");
  };

  return (
    <div className="mx-auto max-w-3xl py-4">
      {/* Back */}
      <button
        type="button"
        onClick={handleBack}
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-main"
      >
        <FiArrowLeft className="h-4 w-4" />
        <span>Back to dashboard</span>
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-main">
          Start with an idea
        </h1>

        <p className="mt-2 text-sm text-muted">
          You don't need a complete specification. Just tell us
          what you're thinking.
        </p>
      </div>

      <div className="space-y-6 rounded-2xl border border-border bg-surface p-6 shadow-xs sm:p-8">
        {/* Product Name */}
        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-muted">
            Product Name
          </label>

          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g. Photographer Marketplace"
            className="w-full border-b border-border bg-transparent py-2 text-sm text-main placeholder:text-muted/60 transition-colors focus:border-brand focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-muted">
            Description
          </label>

          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you're building..."
            className="w-full resize-none rounded-xl border border-border bg-background p-4 text-sm text-main placeholder:text-muted/60 transition-colors focus:border-brand focus:outline-none"
          />
        </div>

        {/* Product Format */}
        <div>
          <label className="mb-3 block text-[11px] font-bold uppercase tracking-wider text-muted">
            Product Format
          </label>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {PRODUCT_FORMATS.map((format) => {
              const isSelected =
                productFormat === format.value;

              return (
                <button
                  key={format.value}
                  type="button"
                  onClick={() =>
                    setProductFormat(format.value)
                  }
                  className={`rounded-xl border p-3 text-left transition-colors ${
                    isSelected
                      ? "border-brand bg-brand/5"
                      : "border-border hover:border-brand/40"
                  }`}
                >
                  <div className="text-sm font-medium text-main">
                    {format.label}
                  </div>

                  <div className="mt-1 text-xs leading-relaxed text-muted">
                    {format.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Info */}
        <div className="flex items-start gap-2 text-xs leading-relaxed text-muted">
          <FiInfo className="mt-0.5 h-4 w-4 shrink-0 text-brand" />

          <span>
            Don't worry about getting it right. We'll ask
            questions where we need clarification.
          </span>
        </div>
      </div>

      {/* Continue */}
      <div className="mt-8 flex justify-end">
        <Button
          onClick={onNext}
          disabled={
            !productName ||
            !description ||
            !productFormat ||
            isLoading
          }
          className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand/90 disabled:opacity-50"
        >
          <span>
            {isLoading ? "Thinking..." : "Start thinking"}
          </span>

          <FiArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}