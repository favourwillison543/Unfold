"use client";

import {
  Background,
  Controls,
  Edge,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowInstance,
  Node,
  getSmoothStepPath,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { FiArrowLeft, FiMaximize2, FiMinimize2 } from "react-icons/fi";

import { usePublicProject } from "@/hooks/usePublicSharing";

type ActorPage = {
  id: number | string;
  name: string;
  purpose?: string | null;
  description?: string | null;
};

type Actor = {
  id: number | string;
  name: string;
  description?: string | null;
  purpose?: string | null;
  pages?: ActorPage[];
};

type PublicFlowPage = {
  id: number | string;
  name: string;
  purpose?: string | null;
  description?: string | null;
};

type WorkflowStep = {
  id: number | string;
  title: string;
  type?: string | null;
  actor?: string | null;
  page?: string | null;
  description?: string | null;
  stepOrder?: number;
};

type WorkflowConnection = {
  id?: number | string;
  from: string | number;
  to: string | number;
  condition?: string | null;
  label?: string | null;
};

type PublicWorkflow = {
  id: number | string;
  name: string;
  description?: string | null;
  actor?: string | null;
  goal?: string | null;
  entryPoint?: string | null;
  completion?: string | null;
  steps?: WorkflowStep[];
  pages?: ActorPage[];
  connections?: WorkflowConnection[];
};

type WorkflowNodeData = {
  kind: "public" | "actor" | "workflow" | "decision";
  label: string;
  description?: string | null;
  page?: string | null;
  actorName?: string | null;
  stepType?: string | null;
  stepOrder?: number;
};

type WorkflowNodeType = Node<WorkflowNodeData>;

const EDGE_COLORS = [
  "#C65D3A",
  "#4F46E5",
  "#0891B2",
  "#16A34A",
  "#9333EA",
  "#D97706",
];

function WorkflowNode({
  data,
}: {
  data: WorkflowNodeData;
}) {
  if (data.kind === "public") {
    return (
      <div className="relative min-w-[210px] rounded-xl border border-brand/30 bg-brand/[0.07] px-4 py-3 shadow-sm">
        <Handle
          type="source"
          position={Position.Bottom}
          className="!h-2 !w-2 !border-2 !border-white !bg-brand"
        />

        <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">
          Public flow
        </div>

        <div className="text-sm font-semibold text-main">
          {data.label}
        </div>

        {data.description && (
          <p className="mt-1 text-xs leading-5 text-muted">
            {data.description}
          </p>
        )}
      </div>
    );
  }

  if (data.kind === "actor") {
    return (
      <div className="relative min-w-[220px] rounded-xl border border-border bg-surface px-4 py-3 shadow-sm">
        <Handle
          type="target"
          position={Position.Top}
          className="!h-2 !w-2 !border-2 !border-white !bg-neutral-500"
        />

        <Handle
          type="source"
          position={Position.Bottom}
          className="!h-2 !w-2 !border-2 !border-white !bg-neutral-500"
        />

        <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
          Actor
        </div>

        <div className="text-sm font-semibold text-main">
          {data.label}
        </div>

        {data.description && (
          <p className="mt-1 text-xs leading-5 text-muted">
            {data.description}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="relative min-w-[240px] rounded-xl border border-border bg-white px-4 py-3 shadow-sm">
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !border-2 !border-white !bg-neutral-400"
      />

      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !border-2 !border-white !bg-neutral-400"
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {data.actorName && (
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
              {data.actorName}
            </div>
          )}

          <div className="text-sm font-semibold text-main">
            {data.label}
          </div>
        </div>

        {data.stepOrder !== undefined && (
          <span className="shrink-0 text-[10px] font-medium text-muted">
            {data.stepOrder}
          </span>
        )}
      </div>

      {data.page && (
        <div className="mt-2 text-[11px] text-brand">
          {data.page}
        </div>
      )}

      {data.description && (
        <p className="mt-1 text-xs leading-5 text-muted">
          {data.description}
        </p>
      )}
    </div>
  );
}

function DecisionNode({
  data,
}: {
  data: WorkflowNodeData;
}) {
  return (
    <div className="relative flex h-[130px] w-[130px] items-center justify-center">
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !border-2 !border-white !bg-amber-500"
      />

      <div className="absolute inset-[12px] rotate-45 rounded-lg border border-amber-300 bg-amber-50 shadow-sm" />

      <div className="relative z-10 max-w-[90px] text-center">
        <div className="mb-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-amber-700">
          Decision
        </div>

        <div className="text-xs font-semibold leading-4 text-amber-950">
          {data.label}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !border-2 !border-white !bg-amber-500"
      />
    </div>
  );
}

const nodeTypes = {
  workflow: WorkflowNode,
  decision: DecisionNode,
};

function CustomWorkflowEdge({
  id,
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  data,
}: any) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16,
  });

  const color =
    typeof data?.color === "string"
      ? data.color
      : "#C65D3A";

  const condition =
    typeof data?.condition === "string"
      ? data.condition
      : null;

  const isFailure =
    condition?.toLowerCase().includes("fail") ||
    condition?.toLowerCase().includes("no") ||
    condition?.toLowerCase().includes("reject");

  const isSuccess =
    condition?.toLowerCase().includes("success") ||
    condition?.toLowerCase().includes("yes") ||
    condition?.toLowerCase().includes("approve");

  return (
    <>
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={isFailure ? "#DC2626" : color}
        strokeWidth={1.8}
        strokeDasharray={isFailure ? "5 4" : undefined}
        markerEnd={`url(#${id}-arrow)`}
      />

      <defs>
        <marker
          id={`${id}-arrow`}
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M 0 0 L 8 4 L 0 8 z"
            fill={isFailure ? "#DC2626" : color}
          />
        </marker>
      </defs>

      {condition && (
        <foreignObject
          x={labelX - 65}
          y={labelY - 15}
          width={130}
          height={32}
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div className="flex h-full items-center justify-center">
            <span
              className={`rounded-full border bg-white px-2 py-1 text-[10px] font-medium shadow-sm ${
                isFailure
                  ? "border-red-200 text-red-600"
                  : isSuccess
                    ? "border-green-200 text-green-600"
                    : "border-border text-muted"
              }`}
            >
              {condition}
            </span>
          </div>
        </foreignObject>
      )}
    </>
  );
}

const edgeTypes = {
  customWorkflow: CustomWorkflowEdge,
};

function PagesPanel({
  publicFlow,
  actors,
}: {
  publicFlow: PublicFlowPage[];
  actors: Actor[];
}) {
  const [showBuiltOnly, setShowBuiltOnly] = useState(false);

  const actorPages = actors.flatMap((actor) =>
    (actor.pages ?? []).map((page) => ({
      ...page,
      actorName: actor.name,
    })),
  );

  const visiblePublicPages = showBuiltOnly
    ? publicFlow.filter(Boolean)
    : publicFlow;

  const visibleActorPages = showBuiltOnly
    ? actorPages.filter(Boolean)
    : actorPages;

  return (
    <div className="absolute left-4 top-4 z-20 w-[270px] overflow-hidden rounded-xl border border-border bg-surface/95 shadow-lg backdrop-blur">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <div className="text-xs font-semibold text-main">
            Project structure
          </div>

          <div className="mt-0.5 text-[10px] text-muted">
            Public and actor pages
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowBuiltOnly((value) => !value)}
          className={`rounded-md border px-2 py-1 text-[10px] font-medium transition-colors ${
            showBuiltOnly
              ? "border-brand/30 bg-brand/10 text-brand"
              : "border-border text-muted hover:text-main"
          }`}
        >
          {showBuiltOnly ? "Built only" : "All pages"}
        </button>
      </div>

      <div className="max-h-[calc(100vh-190px)] overflow-y-auto p-3">
        {visiblePublicPages.length > 0 && (
          <div>
            <div className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
              Public flow
            </div>

            <div className="space-y-1">
              {visiblePublicPages.map((page) => (
                <div
                  key={`public-page-${page.id}`}
                  className="rounded-lg border border-border/70 bg-background px-3 py-2"
                >
                  <div className="text-xs font-medium text-main">
                    {page.name}
                  </div>

                  {page.description && (
                    <div className="mt-0.5 text-[10px] leading-4 text-muted">
                      {page.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {visibleActorPages.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
              Actor pages
            </div>

            <div className="space-y-1">
              {visibleActorPages.map((page) => (
                <div
                  key={`actor-page-${page.id}-${page.actorName}`}
                  className="rounded-lg border border-border/70 bg-background px-3 py-2"
                >
                  <div className="text-[10px] font-medium text-brand">
                    {page.actorName}
                  </div>

                  <div className="mt-0.5 text-xs font-medium text-main">
                    {page.name}
                  </div>

                  {page.description && (
                    <div className="mt-0.5 text-[10px] leading-4 text-muted">
                      {page.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {visiblePublicPages.length === 0 &&
          visibleActorPages.length === 0 && (
            <div className="px-1 py-5 text-center text-xs text-muted">
              No pages available.
            </div>
          )}
      </div>
    </div>
  );
}

function getPersonName(person: any, index: number) {
  return (
    person?.name ??
    person?.actor ??
    person?.role ??
    person?.title ??
    `Actor ${index + 1}`
  );
}

function getPersonDescription(person: any) {
  return (
    person?.description ??
    person?.purpose ??
    person?.goal ??
    null
  );
}

function normalizeActors(
  people: any[] = [],
): Actor[] {
  return people.map((person, index) => ({
    id: person?.id ?? index + 1,
    name: getPersonName(person, index),
    description: getPersonDescription(person),
    purpose: person?.purpose ?? person?.goal ?? null,
    pages: Array.isArray(person?.pages)
      ? person.pages.map((page: any, pageIndex: number) => ({
          id: page?.id ?? `${index}-${pageIndex}`,
          name:
            page?.name ??
            page?.title ??
            `Page ${pageIndex + 1}`,
          purpose: page?.purpose ?? null,
          description: page?.description ?? null,
        }))
      : [],
  }));
}

function normalizeWorkflows(
  workflows: any[] = [],
): PublicWorkflow[] {
  return workflows.map((workflow) => ({
    id: workflow?.id,
    name: workflow?.name ?? "Untitled workflow",
    description: workflow?.description ?? null,
    actor: workflow?.actor ?? null,
    goal: workflow?.goal ?? null,
    entryPoint: workflow?.entryPoint ?? null,
    completion: workflow?.completion ?? null,
    steps: Array.isArray(workflow?.steps)
      ? workflow.steps.map((step: any, index: number) => ({
          id: step?.id ?? index + 1,
          title: step?.title ?? `Step ${index + 1}`,
          type: step?.type ?? "action",
          actor: step?.actor ?? null,
          page: step?.page ?? null,
          description: step?.description ?? null,
          stepOrder:
            typeof step?.stepOrder === "number"
              ? step.stepOrder
              : index + 1,
        }))
      : [],
    pages: Array.isArray(workflow?.pages)
      ? workflow.pages
      : [],
    connections: Array.isArray(workflow?.connections)
      ? workflow.connections
      : [],
  }));
}

function normalizePublicFlow(
  data: any,
): PublicFlowPage[] {
  const publicFlow =
    data?.publicFlow ??
    data?.structure?.publicFlow ??
    data?.workflowStructure?.publicFlow ??
    [];

  if (!Array.isArray(publicFlow)) {
    return [];
  }

  return publicFlow.map((page: any, index: number) => ({
    id: page?.id ?? index + 1,
    name:
      page?.name ??
      page?.title ??
      `Public page ${index + 1}`,
    purpose: page?.purpose ?? null,
    description: page?.description ?? null,
  }));
}

function buildNodes(
  actors: Actor[],
  publicFlow: PublicFlowPage[],
  workflows: PublicWorkflow[],
): WorkflowNodeType[] {
  const nodes: WorkflowNodeType[] = [];

  publicFlow.forEach((page, index) => {
    nodes.push({
      id: `public-${page.id}`,
      type: "workflow",
      position: {
        x: 100 + index * 300,
        y: 60,
      },
      data: {
        kind: "public",
        label: page.name,
        description:
          page.description ?? page.purpose ?? null,
      },
    });
  });

  actors.forEach((actor, actorIndex) => {
    const actorWorkflows = workflows.filter(
      (workflow) =>
        workflow.actor?.toLowerCase() ===
        actor.name.toLowerCase(),
    );

    nodes.push({
      id: `actor-${actor.id}`,
      type: "workflow",
      position: {
        x: 100 + actorIndex * 320,
        y: 290,
      },
      data: {
        kind: "actor",
        label: actor.name,
        description:
          actor.description ?? actor.purpose ?? null,
      },
    });

    actorWorkflows.forEach((workflow) => {
      const steps = [...(workflow.steps ?? [])].sort(
        (a, b) =>
          (a.stepOrder ?? 0) -
          (b.stepOrder ?? 0),
      );

      steps.forEach((step, stepIndex) => {
        const hasDecisionConnection =
          workflow.connections?.some(
            (connection) =>
              String(connection.from) === String(step.id) &&
              Boolean(connection.condition),
          );

        const isDecision =
          step.type?.toLowerCase() ===
            "decision" ||
          hasDecisionConnection;

        nodes.push({
          id: `workflow-${workflow.id}-step-${step.id}`,
          type: isDecision
            ? "decision"
            : "workflow",
          position: {
            x: 100 + actorIndex * 320,
            y: 470 + stepIndex * 240,
          },
          data: {
            kind: isDecision
              ? "decision"
              : "workflow",
            label: step.title,
            description: step.description,
            page: step.page,
            actorName: actor.name,
            stepType: step.type,
            stepOrder: step.stepOrder,
          },
        });
      });
    });
  });

  return nodes;
}

function buildEdges(
  actors: Actor[],
  publicFlow: PublicFlowPage[],
  workflows: PublicWorkflow[],
): Edge[] {
  const edges: Edge[] = [];

  publicFlow.forEach((page, pageIndex) => {
    actors.forEach((actor, actorIndex) => {
      edges.push({
        id: `public-${page.id}-actor-${actor.id}`,
        source: `public-${page.id}`,
        target: `actor-${actor.id}`,
        type: "customWorkflow",
        animated: true,
        data: {
          color:
            EDGE_COLORS[
              (pageIndex + actorIndex) %
                EDGE_COLORS.length
            ],
        },
      });
    });
  });

  actors.forEach((actor, actorIndex) => {
    const actorWorkflows = workflows.filter(
      (workflow) =>
        workflow.actor?.toLowerCase() ===
        actor.name.toLowerCase(),
    );

    actorWorkflows.forEach((workflow) => {
      const steps = [...(workflow.steps ?? [])].sort(
        (a, b) =>
          (a.stepOrder ?? 0) -
          (b.stepOrder ?? 0),
      );

      if (steps.length === 0) {
        return;
      }

      edges.push({
        id: `actor-${actor.id}-workflow-${workflow.id}`,
        source: `actor-${actor.id}`,
        target: `workflow-${workflow.id}-step-${steps[0].id}`,
        type: "customWorkflow",
        data: {
          color:
            EDGE_COLORS[
              actorIndex % EDGE_COLORS.length
            ],
        },
      });

      const explicitConnections =
        workflow.connections ?? [];

      steps.forEach((step, stepIndex) => {
        if (stepIndex >= steps.length - 1) {
          return;
        }

        const nextStep = steps[stepIndex + 1];

        const explicitConnection =
          explicitConnections.find(
            (connection) =>
              String(connection.from) ===
                String(step.id) &&
              String(connection.to) ===
                String(nextStep.id),
          );

        if (explicitConnection) {
          return;
        }

        edges.push({
          id: `fallback-${workflow.id}-${step.id}-${nextStep.id}`,
          source: `workflow-${workflow.id}-step-${step.id}`,
          target: `workflow-${workflow.id}-step-${nextStep.id}`,
          type: "customWorkflow",
          data: {
            color:
              EDGE_COLORS[
                actorIndex % EDGE_COLORS.length
              ],
          },
        });
      });

      explicitConnections.forEach(
        (connection, connectionIndex) => {
          edges.push({
            id:
              `connection-${workflow.id}-${connection.id ?? connectionIndex}`,
            source:
              `workflow-${workflow.id}-step-${connection.from}`,
            target:
              `workflow-${workflow.id}-step-${connection.to}`,
            type: "customWorkflow",
            data: {
              color:
                EDGE_COLORS[
                  actorIndex % EDGE_COLORS.length
                ],
              condition:
                connection.condition ??
                connection.label ??
                null,
            },
          });
        },
      );
    });
  });

  return edges;
}

export default function PublicFullProjectWorkflowPage() {
  const params = useParams();
  const router = useRouter();

  const token = String(params.token);

  const {
    data,
    isLoading,
    isError,
  } = usePublicProject(token);

  const [isMaximized, setIsMaximized] =
    useState(false);

  const reactFlowInstanceRef =
    useRef<
      ReactFlowInstance<
        WorkflowNodeType,
        Edge
      > | null
    >(null);

  const project = data?.project;

  const actors = useMemo(
    () =>
      normalizeActors(
        Array.isArray(data?.analysis?.people)
          ? data.analysis.people
          : [],
      ),
    [data],
  );

  const workflows = useMemo(
    () =>
      normalizeWorkflows(
        Array.isArray(data?.workflows)
          ? data.workflows
          : [],
      ),
    [data],
  );

  const publicFlow = useMemo(
    () => normalizePublicFlow(data),
    [data],
  );

  const nodes = useMemo(
    () =>
      buildNodes(
        actors,
        publicFlow,
        workflows,
      ),
    [actors, publicFlow, workflows],
  );

  const edges = useMemo(
    () =>
      buildEdges(
        actors,
        publicFlow,
        workflows,
      ),
    [actors, publicFlow, workflows],
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted">
          Loading project workflow...
        </div>
      </div>
    );
  }

  if (isError || !data || !project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-main">
            Project unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted">
            This public project link may have expired,
            been disabled, or no longer exists.
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(`/share/${token}`)
            }
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand/90"
          >
            <FiArrowLeft size={15} />
            Back to project
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-main">
      {!isMaximized && (
        <header className="border-b border-border bg-surface">
          <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-5 py-4">
            <div className="min-w-0">
              <button
                type="button"
                onClick={() =>
                  router.push(`/share/${token}`)
                }
                className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-main"
              >
                <FiArrowLeft size={13} />
                Back to project
              </button>

              <h1 className="truncate text-lg font-semibold tracking-tight">
                {project.name}
              </h1>

              <p className="mt-0.5 text-xs text-muted">
                Full product workflow
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsMaximized(true);

                requestAnimationFrame(() => {
                  reactFlowInstanceRef.current?.fitView({
                    padding: 0.2,
                    duration: 300,
                  });
                });
              }}
              className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-main transition-colors hover:bg-background"
            >
              <FiMaximize2 size={14} />
              Fullscreen
            </button>
          </div>
        </header>
      )}

      <div
        className={`relative w-full ${
          isMaximized
            ? "fixed inset-0 z-[100] bg-background"
            : "flex-1 min-h-[calc(100vh-78px)]"
        }`}
      >
        {!isMaximized && (
          <PagesPanel
            publicFlow={publicFlow}
            actors={actors}
          />
        )}

        {isMaximized && (
          <button
            type="button"
            onClick={() => {
              setIsMaximized(false);

              requestAnimationFrame(() => {
                reactFlowInstanceRef.current?.fitView({
                  padding: 0.2,
                  duration: 300,
                });
              });
            }}
            className="absolute right-5 top-5 z-30 flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-main shadow-lg transition-colors hover:bg-background"
          >
            <FiMinimize2 size={14} />
            Exit fullscreen
          </button>
        )}

        {nodes.length === 0 ? (
          <div className="flex h-full min-h-[500px] items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-medium text-main">
                No workflow structure yet
              </p>

              <p className="mt-1 text-xs text-muted">
                This project does not have a generated
                workflow structure to display.
              </p>
            </div>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            fitViewOptions={{
              padding: 0.2,
              minZoom: 0.25,
              maxZoom: 1.2,
            }}
            onInit={(instance) => {
              reactFlowInstanceRef.current =
                instance;
            }}
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
            proOptions={{
              hideAttribution: true,
            }}
          >
            <Background
              gap={20}
              size={1}
            />

            <Controls
              showInteractive={false}
              position="bottom-right"
            />

            <MiniMap
              position="bottom-left"
              pannable
              zoomable
              nodeStrokeWidth={2}
              className="!overflow-hidden !rounded-xl !border !border-border !bg-surface"
            />
          </ReactFlow>
        )}
      </div>
    </div>
  );
}