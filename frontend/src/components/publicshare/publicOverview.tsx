"use client";

import { BiQuestionMark } from "react-icons/bi";

import {
  FiAlertCircle,
  FiBox,
  FiCheckCircle,
  FiGitBranch,
  FiMonitor,
  FiTarget,
  FiUser,
} from "react-icons/fi";

import { LuWorkflow } from "react-icons/lu";

type PublicOverviewProps = {
  project: {
    id: number;
    name: string;
    description: string | null;
    productFormat: string;
  };

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
      id?: number;
      question?: string;
      answer?: string | null;
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
};

const GRAPH_W = 640;
const GRAPH_H = 360;

type GraphNode = {
  name: string;
  x: number;
  y: number;
};

function layoutNodes(names: string[]): GraphNode[] {
  const cx = GRAPH_W / 2;
  const cy = GRAPH_H / 2;

  const radiusX = GRAPH_W / 2 - 90;
  const radiusY = GRAPH_H / 2 - 60;

  const count = names.length;

  return names.map((name, i) => {
    const angle =
      (i / count) * Math.PI * 2 - Math.PI / 2;

    return {
      name,
      x: cx + radiusX * Math.cos(angle),
      y: cy + radiusY * Math.sin(angle),
    };
  });
}

function pct(value: number, total: number) {
  return `${(value / total) * 100}%`;
}

export default function PublicOverview({
  analysis,
}: PublicOverviewProps) {
  if (!analysis) {
    return (
      <div className="mt-6 rounded-xl border border-dashed border-border px-4 py-8 text-center text-xs text-muted">
        No product analysis is available yet.
      </div>
    );
  }

  const relationships =
    analysis.relationships?.slice(0, 6) ?? [];

  const entities =
    analysis.entities?.slice(0, 7) ?? [];

  const totalQuestions =
    analysis.questions?.length ?? 0;

  const unansweredQuestions =
    analysis.questions?.filter(
      (question) => !question.answer
    ).length ?? 0;

  const isResolved =
    unansweredQuestions === 0;

  const percentComplete =
    totalQuestions > 0
      ? Math.round(
          ((totalQuestions -
            unansweredQuestions) /
            totalQuestions) *
            100
        )
      : 100;

  const nodeNames = Array.from(
    new Set([
      ...relationships.flatMap((relationship) => [
        relationship.from,
        relationship.to,
      ]),
      ...entities.map((entity) => entity.name),
    ])
  ).slice(0, 7);

  const showDiagram =
    nodeNames.length >= 2 &&
    relationships.length > 0;

  const nodes = showDiagram
    ? layoutNodes(nodeNames)
    : [];

  const nodeMap = new Map(
    nodes.map((node) => [node.name, node])
  );

  return (
    <div className="mt-6 space-y-7">
      {/* Snapshot */}
      <section className="relative overflow-hidden rounded-xl border border-brand/15 bg-brand/[0.035] p-5">
        <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-brand/[0.06] blur-2xl" />

        <div className="relative space-y-4">
          <div>
            <p className="text-xs font-medium text-muted">
              What Unfold understands so far
            </p>

            <p className="mt-1 max-w-2xl text-[13px] leading-6 text-main">
              {analysis.understanding ||
                "The product is still being understood."}
            </p>
          </div>

          <div className="relative h-2.5 w-full overflow-hidden rounded-full border border-brand/15 bg-brand/10 p-0.5">
            <div
              className="relative h-full rounded-full bg-brand transition-all duration-700 ease-out"
              style={{
                width: `${percentComplete}%`,
              }}
            >
              <div className="absolute inset-0 animate-pulse rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Product model */}
      {analysis.productModel && (
        <section className="grid overflow-hidden rounded-xl border border-border bg-surface divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="px-4 py-4 transition-colors hover:bg-background/70">
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted">
              <BiQuestionMark size={13} />
              What it is
            </p>

            <p className="mt-2 text-[13px] leading-5 text-main">
              {analysis.productModel.role}
            </p>
          </div>

          <div className="px-4 py-4 transition-colors hover:bg-background/70">
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted">
              <FiUser size={12} />
              Customer
            </p>

            <p className="mt-2 text-[13px] leading-5 text-main">
              {analysis.productModel.directCustomer}
            </p>
          </div>

          <div className="px-4 py-4 transition-colors hover:bg-background/70">
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted">
              <FiMonitor size={12} />
              Used through
            </p>

            <p className="mt-2 text-[13px] leading-5 text-main">
              {analysis.productModel.usageMode}
            </p>

            {analysis.productModel
              .primaryInterfaces?.length > 0 && (
              <p className="mt-1 text-xs leading-5 text-muted">
                {analysis.productModel.primaryInterfaces.join(
                  " · "
                )}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Product structure */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand/8 text-brand">
              <FiGitBranch size={13} />
            </span>

            <h2 className="text-[13px] font-semibold text-main">
              Product structure
            </h2>
          </div>

          {entities.length > 0 && (
            <p className="text-xs text-muted">
              {entities.length}{" "}
              {entities.length === 1
                ? "entity"
                : "entities"}
              {relationships.length > 0 &&
                ` · ${relationships.length} ${
                  relationships.length === 1
                    ? "relationship"
                    : "relationships"
                }`}
            </p>
          )}
        </div>

        {showDiagram ? (
          <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-[1.5fr_1fr]">
            <div
              className="relative bg-surface"
              style={{
                aspectRatio: `${GRAPH_W} / ${GRAPH_H}`,
                backgroundImage:
                  "radial-gradient(circle, #E7E5E4 1px, transparent 1px)",
                backgroundSize: "18px 18px",
              }}
            >
              <svg
                viewBox={`0 0 ${GRAPH_W} ${GRAPH_H}`}
                className="absolute inset-0 h-full w-full"
              >
                <defs>
                  <marker
                    id="public-overview-arrow"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto-start-reverse"
                  >
                    <path
                      d="M0,0 L10,5 L0,10 z"
                      fill="#C65D3A"
                      fillOpacity={0.55}
                    />
                  </marker>
                </defs>

                {relationships.map(
                  (relationship, index) => {
                    const from = nodeMap.get(
                      relationship.from
                    );

                    const to = nodeMap.get(
                      relationship.to
                    );

                    if (!from || !to) {
                      return null;
                    }

                    const midX =
                      (from.x + to.x) / 2;

                    const midY =
                      (from.y + to.y) / 2;

                    const dx =
                      to.x - from.x;

                    const dy =
                      to.y - from.y;

                    const length =
                      Math.hypot(dx, dy) || 1;

                    const nx =
                      (-dy / length) *
                      (index % 2 === 0
                        ? 10
                        : -10);

                    const ny =
                      (dx / length) *
                      (index % 2 === 0
                        ? 10
                        : -10);

                    const labelX =
                      midX + nx;

                    const labelY =
                      midY + ny;

                    const labelW =
                      relationship.relationship
                        .length *
                        6 +
                      12;

                    return (
                      <g
                        key={
                          relationship.id
                        }
                      >
                        <line
                          x1={from.x}
                          y1={from.y}
                          x2={to.x}
                          y2={to.y}
                          stroke="#C4C0BC"
                          strokeWidth={1.25}
                          markerEnd="url(#public-overview-arrow)"
                        />

                        <rect
                          x={
                            labelX -
                            labelW / 2
                          }
                          y={
                            labelY - 9
                          }
                          width={labelW}
                          height={18}
                          rx={4}
                          fill="#FFFDFB"
                        />

                        <text
                          x={labelX}
                          y={labelY + 4}
                          textAnchor="middle"
                          fontSize="10.5"
                          fill="#71717A"
                        >
                          {
                            relationship.relationship
                          }
                        </text>
                      </g>
                    );
                  }
                )}
              </svg>

              {nodes.map((node) => (
                <div
                  key={node.name}
                  className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-main shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                  style={{
                    left: pct(
                      node.x,
                      GRAPH_W
                    ),
                    top: pct(
                      node.y,
                      GRAPH_H
                    ),
                  }}
                >
                  {node.name}
                </div>
              ))}
            </div>

            <div className="h-full divide-y divide-border overflow-y-auto bg-surface">
              {entities.length > 0 ? (
                entities.map((entity) => (
                  <div
                    key={entity.id}
                    className="group flex items-start gap-2 px-4 py-3 transition-colors hover:bg-background"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-background text-muted group-hover:text-brand">
                      <LuWorkflow size={12} />
                    </span>

                    <div>
                      <p className="text-[13px] font-medium text-main">
                        {entity.name}
                      </p>

                      <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted">
                        {entity.description ||
                          "No description provided."}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="px-4 py-4 text-xs text-muted">
                  Nodes are drawn from tracked
                  relationships.
                </p>
              )}
            </div>
          </div>
        ) : entities.length > 0 ? (
          <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
            {entities.map((entity) => (
              <div
                key={entity.id}
                className="group flex items-start gap-2 px-4 py-3.5 transition-colors hover:bg-background"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-background text-muted group-hover:text-brand">
                  <FiBox size={12} />
                </span>

                <div>
                  <p className="text-[13px] font-medium text-main">
                    {entity.name}
                  </p>

                  <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted">
                    {entity.description ||
                      "No description provided."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-xs text-muted">
            No entities or relationships have
            been established yet.
          </p>
        )}
      </section>

      {/* Actor goals */}
      {analysis.actorGoals.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand/8 text-brand">
              <FiTarget size={13} />
            </span>

            <h2 className="text-[13px] font-semibold text-main">
              What the product needs to help people
              accomplish
            </h2>
          </div>

          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {analysis.actorGoals
              .slice(0, 4)
              .map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-start gap-3"
                >
                  <span className="mt-0.5 shrink-0 text-[11px] font-medium text-brand">
                    {goal.actor}
                  </span>

                  <p className="text-[13px] leading-5 text-main">
                    {goal.goal}
                  </p>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Refinement state */}
      <section className="flex items-center gap-2 border-t border-border pt-5 text-[13px]">
        {isResolved ? (
          <FiCheckCircle
            size={14}
            className="shrink-0 text-emerald-600"
          />
        ) : (
          <FiAlertCircle
            size={14}
            className="shrink-0 text-brand"
          />
        )}

        <span className="text-main">
          {isResolved
            ? "No unresolved questions — the model is up to date."
            : `${unansweredQuestions} ${
                unansweredQuestions === 1
                  ? "question"
                  : "questions"
              } still open and may change this model.`}
        </span>
      </section>
    </div>
  );
}