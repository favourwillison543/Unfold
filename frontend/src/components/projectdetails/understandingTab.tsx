"use client";

import { Analysis } from "@/types/project";

import {
  FiBox,
  FiCheck,
  FiHelpCircle,
  FiLayers,
  FiMonitor,
  FiUser,
} from "react-icons/fi";

type UnderstandingTabProps = {
  analysis: Analysis;
};

export default function UnderstandingTab({
  analysis,
}: UnderstandingTabProps) {
  const productModel = analysis.productModel;

  return (
    <div className="mt-6 space-y-8">
      {/* Current understanding */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand/8 text-brand">
            <FiBox size={13} />
          </span>

          <h2 className="text-[13px] font-semibold text-main">
            Current understanding
          </h2>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          {analysis.understanding ? (
            <p className="max-w-4xl text-[13px] leading-6 text-main">
              {analysis.understanding}
            </p>
          ) : (
            <p className="text-[13px] text-muted">
              An understanding of this product has not been established yet.
            </p>
          )}
        </div>
      </section>

      {/* Product model */}
      <section>
        <div className="mb-3">
          <h2 className="text-[13px] font-semibold text-main">
            Product model
          </h2>

          <p className="mt-1 text-xs text-muted">
            The core definition of the product and how it is used.
          </p>
        </div>

        {productModel ? (
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="grid sm:grid-cols-2">
              <div className="border-b border-border p-4 transition-colors hover:bg-background sm:border-r">
                <div className="flex items-center gap-2">
                  <FiBox size={14} className="text-muted" />

                  <span className="text-xs font-medium text-muted">
                    What it is
                  </span>
                </div>

                <p className="mt-2 text-[13px] leading-5 text-main">
                  {productModel.role}
                </p>
              </div>

              <div className="border-b border-border p-4 transition-colors hover:bg-background">
                <div className="flex items-center gap-2">
                  <FiUser size={14} className="text-muted" />

                  <span className="text-xs font-medium text-muted">
                    Direct customer
                  </span>
                </div>

                <p className="mt-2 text-[13px] leading-5 text-main">
                  {productModel.directCustomer}
                </p>
              </div>

              <div className="border-b border-border p-4 transition-colors hover:bg-background sm:border-b-0 sm:border-r">
                <div className="flex items-center gap-2">
                  <FiMonitor size={14} className="text-muted" />

                  <span className="text-xs font-medium text-muted">
                    How it is used
                  </span>
                </div>

                <p className="mt-2 text-[13px] leading-5 text-main">
                  {productModel.usageMode}
                </p>
              </div>

              <div className="p-4 transition-colors hover:bg-background">
                <div className="flex items-center gap-2">
                  <FiLayers size={14} className="text-muted" />

                  <span className="text-xs font-medium text-muted">
                    Primary interfaces
                  </span>
                </div>

                {productModel.primaryInterfaces.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1">
                    {productModel.primaryInterfaces.map((item) => (
                      <span
                        key={item}
                        className="text-[13px] leading-5 text-main"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-[13px] text-muted">
                    None identified yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-[13px] text-muted">
            The product model has not been established yet.
          </div>
        )}
      </section>

      {/* Product classification */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand/8 text-brand">
            <FiLayers size={13} />
          </span>

          <h2 className="text-[13px] font-semibold text-main">
            Product classification
          </h2>
        </div>

        {analysis.productTypes.length > 0 ? (
          <div className="rounded-xl border border-border bg-surface">
            {analysis.productTypes.map((type, index) => (
              <div
                key={type.id}
                className={`flex items-center gap-3 px-4 py-3 ${
                  index !== analysis.productTypes.length - 1
                    ? "border-b border-border"
                    : ""
                }`}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/8 text-brand">
                  <FiCheck size={11} strokeWidth={2.2} />
                </span>

                <span className="text-[13px] text-main">
                  {type.name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-[13px] text-muted">
            No product classification has been established yet.
          </div>
        )}
      </section>

      {/* Open understanding */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand/8 text-brand">
            <FiHelpCircle size={13} />
          </span>

          <h2 className="text-[13px] font-semibold text-main">
            Still uncertain
          </h2>
        </div>

        <div className="rounded-xl border border-border bg-surface">
          {analysis.questions.length > 0 ? (
            <div className="flex items-start justify-between gap-6 p-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand/8 text-brand">
                  <FiHelpCircle size={14} />
                </span>

                <div>
                  <p className="text-[13px] font-medium text-main">
                    {analysis.questions.length}{" "}
                    {analysis.questions.length === 1
                      ? "question"
                      : "questions"}{" "}
                    still open
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted">
                    These may change the current product model.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="shrink-0 text-xs font-medium text-main transition-colors hover:text-brand"
              >
                Review
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <FiCheck size={14} />
              </span>

              <div>
                <p className="text-[13px] font-medium text-main">
                  Nothing unresolved
                </p>

                <p className="mt-1 text-xs text-muted">
                  The current product understanding is clear.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}