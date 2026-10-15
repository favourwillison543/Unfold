"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type Edge,
  type EdgeProps,
  type Node,
  type ReactFlowInstance,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import {
  FiArrowLeft,
  FiCheck,
  FiChevronDown,
  FiChevronRight,
  FiFile,
  FiHelpCircle,
  FiLogIn,
  FiMaximize2,
  FiMinimize2,
  FiUser,
  FiX,
} from "react-icons/fi";

import {
  useProjectStructure,
  useProjectWorkflows,
} from "@/hooks/useWorkflow";

/* ==========================================================================
   TYPES
   ========================================================================== */

type ActorPage = {
  id: number;
  name: string;
  purpose?: string;
  description?: string;
};

type WorkflowNodeData = {
  kind: "public" | "actor" | "workflow" | "decision";
  label: string;
  description?: string;
  page?: string | null;
  actorName?: string;
  stepType?: string;
  stepOrder?: number;
};

type ActorWorkflowCanvasProps = {
  workflows: any[];
};

/* ==========================================================================
   COLORS
   ========================================================================== */

const EDGE_COLORS = [
  "#0284c7",
  "#16a34a",
  "#9333ea",
  "#d97706",
];

/* ==========================================================================
   CUSTOM EDGE
   ========================================================================== */

function CustomWorkflowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] =
    getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius: 0,
      offset: 36,
    });

  const color =
    (data?.color as string) || "#9ca3af";

  const isDimmed = Boolean(data?.isDimmed);

  const condition = String(label ?? "")
    .trim()
    .toLowerCase();

  const isSuccessCondition =
    condition === "yes" ||
    condition.includes("true") ||
    condition.includes("success");

  const isFailureCondition =
    condition === "no" ||
    condition.includes("false") ||
    condition.includes("fail") ||
    condition.includes("not found");

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: color,
          strokeWidth: 2.5,
          opacity: isDimmed ? 0.15 : 1,
          transition: "opacity 150ms ease",
        }}
      />

      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
              opacity: isDimmed ? 0.25 : 1,
              transition: "opacity 150ms ease",
            }}
            className="nodrag nopan"
          >
            {isSuccessCondition || isFailureCondition ? (
              <div
                className={[
                  "flex h-6 w-6 items-center justify-center rounded-full text-white shadow-sm",
                  isSuccessCondition
                    ? "bg-emerald-500"
                    : "bg-red-500",
                ].join(" ")}
              >
                {isSuccessCondition ? (
                  <FiCheck className="h-3.5 w-3.5" />
                ) : (
                  <FiX className="h-3.5 w-3.5" />
                )}
              </div>
            ) : (
              <div
                className="rounded-full bg-white px-3 py-1 text-[11px] font-medium shadow-sm"
                style={{
                  border: `1.5px solid ${color}`,
                  color,
                }}
              >
                {label}
              </div>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

/* ==========================================================================
   CUSTOM NODE
   ========================================================================== */

function WorkflowNode({
  data,
}: {
  data: WorkflowNodeData;
}) {
  if (data.kind === "public") {
    return (
      <div className="relative flex min-h-[82px] w-[230px] items-center rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
        <Handle
          type="target"
          position={Position.Top}
          className="!h-2.5 !w-2.5 !border-2 !border-gray-300 !bg-white"
        />

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0284c7]/10 text-[#0284c7]">
            <FiLogIn className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <span className="block text-[9px] font-bold uppercase tracking-widest text-[#0284c7]">
              Public Entry
            </span>

            <p className="mt-1 truncate text-xs font-semibold text-gray-900">
              {data.label}
            </p>

            {data.description && (
              <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-gray-500">
                {data.description}
              </p>
            )}
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="!h-2.5 !w-2.5 !border-2 !border-gray-300 !bg-white"
        />
      </div>
    );
  }

  if (data.kind === "actor") {
    return (
      <div className="relative flex min-h-[92px] w-[240px] items-center rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
        <Handle
          type="target"
          position={Position.Top}
          className="!h-2.5 !w-2.5 !border-2 !border-gray-300 !bg-white"
        />

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
            <FiUser className="h-4.5 w-4.5" />
          </div>

          <div className="min-w-0">
            <span className="inline-block rounded-md bg-gray-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gray-500">
              Actor Role
            </span>

            <p className="mt-1 truncate text-sm font-semibold text-gray-900">
              {data.label}
            </p>

            {data.description && (
              <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-gray-500">
                {data.description}
              </p>
            )}
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="!h-2.5 !w-2.5 !border-2 !border-gray-300 !bg-white"
        />
      </div>
    );
  }

  const stepType =
    data.stepType?.toLowerCase() || "";

  const isSuccess = stepType === "success";
  const isFailure = stepType === "failure";
  const isAlternative = stepType === "alternative";

  return (
    <div
      className={[
        "relative flex min-h-[160px] w-[220px] flex-col justify-between rounded-xl border bg-white p-4 shadow-sm",
        "transition-all duration-150 hover:shadow-md",
        isSuccess
          ? "border-emerald-200"
          : isFailure
            ? "border-red-200"
            : isAlternative
              ? "border-purple-200"
              : "border-gray-200",
      ].join(" ")}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-3 !w-3 !border-2 !border-gray-300 !bg-white"
      />

      <div>
        <div
          className={[
            "mb-2 h-1.5 w-8 rounded-full",
            isSuccess
              ? "bg-emerald-300"
              : isFailure
                ? "bg-red-300"
                : isAlternative
                  ? "bg-purple-300"
                  : "bg-gray-200",
          ].join(" ")}
        />

        <div className="flex items-center justify-between gap-2">
          <span
            className={[
              "text-[9px] font-bold uppercase tracking-wider",
              isSuccess
                ? "text-emerald-600"
                : isFailure
                  ? "text-red-600"
                  : isAlternative
                    ? "text-purple-600"
                    : "text-gray-400",
            ].join(" ")}
          >
            Step {data.stepOrder}
          </span>

          {data.page && (
            <span className="flex max-w-[100px] items-center gap-1 truncate text-[10px] font-medium text-gray-400">
              <FiFile className="h-3 w-3 shrink-0" />
              {data.page}
            </span>
          )}
        </div>

        <h4 className="mt-2 text-xs font-semibold leading-snug text-gray-900">
          {data.label}
        </h4>

        {data.description && (
          <p className="mt-1.5 line-clamp-3 text-[11px] leading-normal text-gray-500">
            {data.description}
          </p>
        )}
      </div>

      {data.page && (
        <div className="mt-2 border-t border-gray-100 pt-1.5">
          <span className="block truncate text-[10px] font-medium text-gray-500">
            {data.page}
          </span>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-3 !w-3 !border-2 !border-gray-300 !bg-white"
      />
    </div>
  );
}

function DecisionNode({
  data,
}: {
  data: WorkflowNodeData;
}) {
  return (
    <div className="relative flex h-[125px] w-[125px] items-center justify-center">
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2.5 !w-2.5 !border-2 !border-gray-300 !bg-white"
      />

      <div className="flex h-[88px] w-[88px] rotate-45 items-center justify-center border-2 border-amber-300 bg-amber-50 shadow-sm">
        <div className="-rotate-45 px-2 text-center">
          <FiHelpCircle className="mx-auto mb-1 h-4 w-4 text-amber-700" />

          <p className="text-[10px] font-semibold leading-tight text-amber-900">
            {data.label}
          </p>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2.5 !w-2.5 !border-2 !border-gray-300 !bg-white"
      />
    </div>
  );
}

const nodeTypes = {
  workflow: WorkflowNode,
  decision: DecisionNode,
};

const edgeTypes = {
  customWorkflow: CustomWorkflowEdge,
};

/* ==========================================================================
   PAGES PANEL
   ========================================================================== */

function PagesPanel({
  publicFlow,
  actors,
}: {
  publicFlow: {
    id: number;
    name: string;
    purpose?: string;
  }[];

  actors: {
    id: number;
    name: string;
    pages?: ActorPage[];
  }[];
}) {
  const [openSections, setOpenSections] =
    useState<Record<string, boolean>>({
      public: true,
    });

  const [builtPageIds, setBuiltPageIds] =
    useState<Set<number>>(new Set());

  const [showBuiltOnly, setShowBuiltOnly] =
    useState(false);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleBuilt = (pageId: number) => {
    setBuiltPageIds((prev) => {
      const next = new Set(prev);

      if (next.has(pageId)) {
        next.delete(pageId);
      } else {
        next.add(pageId);
      }

      return next;
    });
  };

  const totalPages =
    publicFlow.length +
    actors.reduce(
      (sum, actor) =>
        sum + (actor.pages?.length || 0),
      0,
    );

  const filteredPublicFlow = showBuiltOnly
    ? publicFlow.filter((page) =>
        builtPageIds.has(page.id),
      )
    : publicFlow;

  return (
    <aside className="flex w-full shrink-0 flex-col border-border/70 bg-surface/80 backdrop-blur-sm lg:w-[320px] lg:border-l">
      <div className="border-b border-border/60 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold uppercase tracking-wider text-main">
              Project Pages
            </p>
          </div>

          <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-bold text-brand">
            {builtPageIds.size}/{totalPages} Built
          </span>
        </div>

        <label className="mt-3 flex items-center gap-2 text-[11px] font-medium text-muted">
          <input
            type="checkbox"
            checked={showBuiltOnly}
            onChange={(event) =>
              setShowBuiltOnly(
                event.target.checked,
              )
            }
            className="h-3.5 w-3.5 accent-brand"
          />

          Show built only
        </label>
      </div>

      <div className="max-h-[720px] space-y-3 overflow-y-auto px-4 py-4">
        <div className="rounded-xl border border-border/60 bg-surface/50 p-2.5 transition-all hover:border-brand/40">
          <button
            type="button"
            onClick={() =>
              toggleSection("public")
            }
            className="flex w-full items-center justify-between px-1 py-1"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-brand/10 text-brand">
                <FiLogIn className="h-3 w-3" />
              </span>

              <span className="text-xs font-bold text-main">
                Public Flow
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-md bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted">
                {filteredPublicFlow.length}
              </span>

              {openSections.public ? (
                <FiChevronDown className="h-3.5 w-3.5 text-muted" />
              ) : (
                <FiChevronRight className="h-3.5 w-3.5 text-muted" />
              )}
            </div>
          </button>

          {openSections.public && (
            <div className="mt-2 space-y-1.5 border-t border-border/40 pt-2">
              {filteredPublicFlow.length === 0 ? (
                <p className="px-2 py-1.5 text-[11px] font-medium italic text-muted/70">
                  No pages to show.
                </p>
              ) : (
                filteredPublicFlow.map((page) => (
                  <div
                    key={page.id}
                    className="group flex items-start gap-2.5 rounded-lg border border-transparent bg-background/50 px-2.5 py-2 transition-all hover:border-brand/30 hover:bg-background"
                  >
                    <input
                      type="checkbox"
                      checked={builtPageIds.has(
                        page.id,
                      )}
                      onChange={() =>
                        toggleBuilt(page.id)
                      }
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-brand"
                    />

                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-xs font-semibold ${
                          builtPageIds.has(page.id)
                            ? "text-muted line-through"
                            : "text-main"
                        }`}
                      >
                        {page.name}
                      </p>

                      {page.purpose && (
                        <p className="mt-0.5 line-clamp-2 text-[10px] leading-3.5 text-muted">
                          {page.purpose}
                        </p>
                      )}
                    </div>

                    <span className="shrink-0 rounded bg-muted/10 px-1 py-0.5 font-mono text-[9px] text-muted">
                      #{page.id}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {actors.map((actor) => {
          const pages = (actor.pages ?? []).filter(
            (page) =>
              showBuiltOnly
                ? builtPageIds.has(page.id)
                : true,
          );

          const isOpen =
            openSections[
              `actor-${actor.id}`
            ];

          return (
            <div
              key={actor.id}
              className="rounded-xl border border-border/60 bg-surface/50 p-2.5 transition-all hover:border-brand/30"
            >
              <button
                type="button"
                onClick={() =>
                  toggleSection(
                    `actor-${actor.id}`,
                  )
                }
                className="flex w-full items-center justify-between px-1 py-1"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-gray-800 text-white">
                    <FiUser className="h-3 w-3" />
                  </span>

                  <span className="text-xs font-bold text-main">
                    {actor.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600">
                    {pages.length}
                  </span>

                  {isOpen ? (
                    <FiChevronDown className="h-3.5 w-3.5 text-muted" />
                  ) : (
                    <FiChevronRight className="h-3.5 w-3.5 text-muted" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="mt-2 space-y-1.5 border-t border-border/40 pt-2">
                  {pages.length === 0 ? (
                    <p className="px-2 py-1.5 text-[11px] font-medium italic text-muted/70">
                      No pages to show.
                    </p>
                  ) : (
                    pages.map((page) => (
                      <div
                        key={page.id}
                        className="group flex items-start gap-2.5 rounded-lg border border-transparent bg-background/50 px-2.5 py-2 transition-all hover:border-border hover:bg-background"
                      >
                        <input
                          type="checkbox"
                          checked={builtPageIds.has(
                            page.id,
                          )}
                          onChange={() =>
                            toggleBuilt(page.id)
                          }
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-brand"
                        />

                        <div className="min-w-0 flex-1">
                          <p
                            className={`truncate text-xs font-semibold ${
                              builtPageIds.has(
                                page.id,
                              )
                                ? "text-muted line-through"
                                : "text-main"
                            }`}
                          >
                            {page.name}
                          </p>

                          {page.purpose && (
                            <p className="mt-0.5 line-clamp-2 text-[10px] leading-3.5 text-muted">
                              {page.purpose}
                            </p>
                          )}
                        </div>

                        <span className="shrink-0 rounded bg-muted/10 px-1 py-0.5 font-mono text-[9px] text-muted">
                          #{page.id}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

/* ==========================================================================
   MAIN PAGE
   ========================================================================== */

export default function FullProjectWorkflowPage() {
  const params = useParams();

  const projectId = Number(
    params.projectid,
  );

  const {
    data: structure,
    isLoading: isStructureLoading,
    isError: isStructureError,
  } = useProjectStructure(projectId);

  const {
    data: workflows = [],
    isLoading: isWorkflowsLoading,
    isError: isWorkflowsError,
  } = useProjectWorkflows(projectId);

  const [
    isMaximized,
    setIsMaximized,
  ] = useState(false);

  const reactFlowInstanceRef =
    useRef<
      ReactFlowInstance<
        Node<WorkflowNodeData>,
        Edge
      > | null
    >(null);

  const actors = structure?.actors ?? [];
  const publicFlow =
    structure?.publicFlow ?? [];

  /* ========================================================================
     NODES
     ======================================================================== */

  const nodes = useMemo<Node<WorkflowNodeData>[]>(
    () => {
      const result: Node<WorkflowNodeData>[] = [];

      /*
       * PUBLIC FLOW
       *
       * Still vertical.
       * Each public page sits above the actor
       * section and connects downward.
       */

      publicFlow.forEach(
        (page, index) => {
          result.push({
            id: `public-${page.id}`,
            type: "workflow",
            position: {
              x: 120 + index * 300,
              y: 60,
            },
            data: {
              kind: "public",
              label: page.name,
              description: page.purpose,
            },
          });
        },
      );

      /* ACTORS */

      actors.forEach(
        (actor, actorIndex) => {
          const actorX =
            140 + actorIndex * 430;

          result.push({
            id: `actor-${actor.id}`,
            type: "workflow",
            position: {
              x: actorX,
              y: 270,
            },
            data: {
              kind: "actor",
              label: actor.name,
              description:
                actor.description,
            },
          });
        },
      );

      /*
       * WORKFLOW STEPS
       *
       * Each actor remains its own vertical lane.
       */

      actors.forEach(
        (actor, actorIndex) => {
          const actorWorkflows =
            workflows.filter(
              (workflow: any) =>
                workflow.actor ===
                actor.name,
            );

          actorWorkflows.forEach(
            (workflow: any) => {
              const steps = [
                ...(workflow.steps ?? []),
              ].sort(
                (a: any, b: any) =>
                  a.stepOrder -
                  b.stepOrder,
              );

              steps.forEach(
                (
                  step: any,
                  stepIndex: number,
                ) => {
                  const isDecision =
                    String(
                      step.type ?? "",
                    ).toLowerCase() ===
                      "decision" ||
                    workflow.connections?.some(
                      (connection: any) =>
                        String(
                          connection.from,
                        ) ===
                          String(step.id) &&
                        Boolean(
                          connection.condition,
                        ),
                    );

                  const nodeId =
                    `workflow-${workflow.id}-step-${step.id}`;

                  const x =
                    150 +
                    actorIndex * 430;

                  const y =
                    440 +
                    stepIndex * 240;

                  result.push({
                    id: nodeId,
                    type: isDecision
                      ? "decision"
                      : "workflow",
                    position: {
                      x,
                      y,
                    },
                    data: {
                      kind: isDecision
                        ? "decision"
                        : "workflow",
                      label:
                        step.title,
                      description:
                        step.description ||
                        "",
                      page:
                        step.page ||
                        null,
                      actorName:
                        workflow.actor,
                      stepType:
                        step.type,
                      stepOrder:
                        step.stepOrder,
                    },
                  });
                },
              );
            },
          );
        },
      );

      return result;
    },
    [
      actors,
      publicFlow,
      workflows,
    ],
  );

  /* ========================================================================
     EDGES
     ======================================================================== */

  const edges = useMemo<Edge[]>(
    () => {
      const result: Edge[] = [];

      /*
       * PUBLIC FLOW -> ACTORS
       *
       * Keep the animation.
       * Use the same blue/cyan arrow language.
       */

      publicFlow.forEach(
        (page, pageIndex) => {
          actors.forEach(
            (actor) => {
              const color =
                EDGE_COLORS[
                  pageIndex %
                    EDGE_COLORS.length
                ];

              result.push({
                id: `public-${page.id}-actor-${actor.id}`,
                source: `public-${page.id}`,
                target: `actor-${actor.id}`,
                type: "customWorkflow",
                animated: true,
                data: {
                  color,
                },
                markerEnd: {
                  type:
                    MarkerType.ArrowClosed,
                  width: 18,
                  height: 18,
                  color,
                },
              });
            },
          );
        },
      );

      /*
       * ACTOR -> FIRST WORKFLOW STEP
       */

      actors.forEach(
        (actor, actorIndex) => {
          const actorWorkflows =
            workflows.filter(
              (workflow: any) =>
                workflow.actor ===
                actor.name,
            );

          actorWorkflows.forEach(
            (workflow: any) => {
              const steps = [
                ...(workflow.steps ?? []),
              ].sort(
                (
                  a: any,
                  b: any,
                ) =>
                  a.stepOrder -
                  b.stepOrder,
              );

              if (!steps.length) {
                return;
              }

              const firstStep =
                steps[0];

              const color =
                EDGE_COLORS[
                  actorIndex %
                    EDGE_COLORS.length
                ];

              result.push({
                id: `actor-${actor.id}-workflow-${workflow.id}`,
                source: `actor-${actor.id}`,
                target: `workflow-${workflow.id}-step-${firstStep.id}`,
                type: "customWorkflow",
                animated: true,
                data: {
                  color,
                },
                markerEnd: {
                  type:
                    MarkerType.ArrowClosed,
                  width: 18,
                  height: 18,
                  color,
                },
              });

              /*
               * Explicit connections
               */

              const explicitPairs =
                new Set(
                  (
                    workflow.connections ??
                    []
                  ).map(
                    (
                      connection: any,
                    ) =>
                      `${connection.from}-${connection.to}`,
                  ),
                );

              (
                workflow.connections ??
                []
              ).forEach(
                (
                  connection: any,
                  connectionIndex: number,
                ) => {
                  const condition =
                    String(
                      connection.condition ??
                        "",
                    )
                      .trim()
                      .toLowerCase();

                  const isSuccess =
                    condition ===
                      "yes" ||
                    condition.includes(
                      "true",
                    ) ||
                    condition.includes(
                      "success",
                    );

                  const isFailure =
                    condition ===
                      "no" ||
                    condition.includes(
                      "false",
                    ) ||
                    condition.includes(
                      "fail",
                    ) ||
                    condition.includes(
                      "not found",
                    );

                  const color =
                    isSuccess
                      ? "#16a34a"
                      : isFailure
                        ? "#dc2626"
                        : EDGE_COLORS[
                            connectionIndex %
                              EDGE_COLORS.length
                          ];

                  result.push({
                    id: `workflow-${workflow.id}-connection-${connection.id}`,
                    source: `workflow-${workflow.id}-step-${connection.from}`,
                    target: `workflow-${workflow.id}-step-${connection.to}`,
                    type: "customWorkflow",
                    animated: true,
                    label:
                      connection.condition ||
                      undefined,
                    data: {
                      color,
                    },
                    markerEnd: {
                      type:
                        MarkerType.ArrowClosed,
                      width: 18,
                      height: 18,
                      color,
                    },
                  });
                },
              );

              /*
               * Sequential fallback.
               *
               * Only create it when the backend
               * didn't already provide that pair.
               */

              steps.forEach(
                (
                  step: any,
                  index: number,
                ) => {
                  if (
                    index ===
                    steps.length - 1
                  ) {
                    return;
                  }

                  const next =
                    steps[index + 1];

                  const pairKey =
                    `${step.id}-${next.id}`;

                  if (
                    explicitPairs.has(
                      pairKey,
                    )
                  ) {
                    return;
                  }

                  const color =
                    EDGE_COLORS[
                      index %
                        EDGE_COLORS.length
                    ];

                  result.push({
                    id: `workflow-${workflow.id}-sequential-${step.id}-${next.id}`,
                    source: `workflow-${workflow.id}-step-${step.id}`,
                    target: `workflow-${workflow.id}-step-${next.id}`,
                    type: "customWorkflow",
                    animated: true,
                    data: {
                      color,
                    },
                    markerEnd: {
                      type:
                        MarkerType.ArrowClosed,
                      width: 18,
                      height: 18,
                      color,
                    },
                  });
                },
              );
            },
          );
        },
      );

      return result;
    },
    [
      actors,
      publicFlow,
      workflows,
    ],
  );

  /* ========================================================================
     FULLSCREEN
     ======================================================================== */

  const handleToggleMaximize =
    useCallback(() => {
      setIsMaximized(
        (current) => !current,
      );

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          reactFlowInstanceRef.current?.fitView(
            {
              padding: 0.08,
              duration: 250,
              minZoom: 0.2,
              maxZoom: 1.5,
            },
          );
        });
      });
    }, []);

  /* ========================================================================
     STATES
     ======================================================================== */

  if (!Number.isFinite(projectId)) {
    return (
      <div className="mt-6 py-16 text-center">
        <p className="text-sm font-semibold text-main">
          Invalid project ID
        </p>
      </div>
    );
  }

  if (
    isStructureLoading ||
    isWorkflowsLoading
  ) {
    return (
      <div className="mx-auto mt-6 w-full max-w-[95%] pb-16">
        <Link
          href={`/project/${projectId}?tab=workflows`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted transition-colors hover:text-brand"
        >
          <FiArrowLeft className="h-3.5 w-3.5" />
          Back to workflows
        </Link>

        <div className="mt-8 flex min-h-[700px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-[#fbfbfd]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />

          <p className="mt-4 text-xs font-semibold text-muted">
            Building workflow diagram...
          </p>
        </div>
      </div>
    );
  }

  if (
    isStructureError ||
    isWorkflowsError
  ) {
    return (
      <div className="mx-auto mt-6 w-full max-w-[95%] pb-16">
        <Link
          href={`/projects/${projectId}?tab=workflows`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted transition-colors hover:text-brand"
        >
          <FiArrowLeft className="h-3.5 w-3.5" />
          Back to workflows
        </Link>

        <div className="mt-8 rounded-2xl border border-gray-100 bg-[#fbfbfd] py-16 text-center">
          <p className="text-sm font-semibold text-main">
            Project structure could not
            be loaded
          </p>

          <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-muted">
            There was a problem loading
            the public flow, actors, or
            generated workflows.
          </p>
        </div>
      </div>
    );
  }

  /* ========================================================================
     PAGE
     ======================================================================== */

  return (
    <div className="mx-auto mt-4 w-full max-w-[95%] pb-16">
      <Link
        href={`/project/${projectId}?tab=workflows`}
        className="inline-flex items-center gap-2 text-xs font-semibold text-muted transition-colors hover:text-brand"
      >
        <FiArrowLeft className="h-3.5 w-3.5" />
        Back to workflows
      </Link>

      <header className="flex flex-col justify-between gap-4 border-b border-border/60 pb-6 md:flex-row md:items-end">
        <div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-main">
            Full Product Workflow
          </h1>

          <p className="mt-2 max-w-2xl text-xs leading-5 text-muted">
            Map out how entry flows funnel
            into specific actor roles,
            decision logic, and
            step-by-step feature
            interactions.
          </p>
        </div>
      </header>

      <section
        className={
          isMaximized
            ? "fixed inset-5 z-50 flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-[#fbfbfd] shadow-2xl"
            : "mt-6"
        }
      >
        <div
          className={
            isMaximized
              ? "flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-3"
              : "mb-3 flex items-center justify-between border-b border-border/60 pb-3"
          }
        >
          <div>
            <p className="text-xs font-semibold text-main">
              Workflow map
            </p>

            <p className="mt-0.5 text-[10px] text-muted">
              Drag to move · scroll to zoom · hold Space to pan
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleMaximize}
            title={
              isMaximized
                ? "Exit full screen"
                : "Full screen"
            }
            className="flex h-8 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            {isMaximized ? (
              <>
                <FiMinimize2 className="h-3.5 w-3.5" />
                Exit full screen
              </>
            ) : (
              <>
                <FiMaximize2 className="h-3.5 w-3.5" />
                Full screen
              </>
            )}
          </button>
        </div>

        <div
          className={
            isMaximized
              ? "flex min-h-0 flex-1 overflow-hidden"
              : "flex w-full flex-col overflow-hidden rounded-2xl border border-gray-200 lg:flex-row"
          }
        >
          <div
            className={
              isMaximized
                ? "relative min-h-0 min-w-0 flex-1"
                : "relative h-[900px] min-w-0 flex-1"
            }
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView
              fitViewOptions={{
                padding: 0.08,
                minZoom: 0.2,
                maxZoom: 1.5,
              }}
              minZoom={0.2}
              maxZoom={1.5}
              nodesConnectable={false}
              nodesDraggable={false}
              elementsSelectable={false}
              panOnScroll={false}
              zoomOnScroll
              zoomOnPinch
              panOnDrag
              panActivationKeyCode="Space"
              selectionOnDrag={false}
              zoomOnDoubleClick={false}
              preventScrolling={false}
              proOptions={{
                hideAttribution: true,
              }}
              onInit={(instance) => {
                reactFlowInstanceRef.current =
                  instance;

                requestAnimationFrame(() => {
                  instance.fitView({
                    padding: 0.08,
                    minZoom: 0.2,
                    maxZoom: 1.5,
                    duration: 0,
                  });
                });
              }}
            >
              <Background
                variant={
                  BackgroundVariant.Dots
                }
                gap={24}
                size={1.5}
                color="#e5e7eb"
              />

              <Controls
                showInteractive={false}
                position="top-left"
                className="!left-4 !top-4 !rounded-xl !border !border-gray-200 !bg-white"
              />
            </ReactFlow>
          </div>

          {!isMaximized && (
            <PagesPanel
              publicFlow={publicFlow}
              actors={actors}
            />
          )}
        </div>
      </section>

      {isMaximized && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={handleToggleMaximize}
        />
      )}

      <style jsx global>{`
        .react-flow__controls-button {
          background: white !important;
          border-color: #e5e7eb !important;
        }

        .react-flow__controls-button svg {
          fill: #6b7280 !important;
        }

        .react-flow__controls-button:hover {
          background: #f9fafb !important;
        }

        .react-flow__attribution {
          display: none !important;
        }

        .react-flow__handle {
          z-index: 10;
        }

        .react-flow__edge {
          transition: opacity 150ms ease;
        }

        .react-flow__edge.animated path {
          animation-duration: 1.5s;
        }

        .react-flow__pane {
          cursor: grab;
        }

        .react-flow__pane:active {
          cursor: grabbing;
        }
      `}</style>
    </div>
  );
}