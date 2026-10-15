"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  FiCheck,
  FiExternalLink,
  FiMaximize2,
  FiMinimize2,
  FiX,
} from "react-icons/fi";

import {
  Background,
  Controls,
  Handle,
  Node,
  Position,
  ReactFlow,
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type Edge,
  type EdgeProps,
  type ReactFlowInstance,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { Workflow } from "@/types/workflow";

type PublicFlowPage = {
  id: number | string;
  name: string;
  description?: string | null;
  purpose?: string | null;
};

type ActorWorkflowCanvasProps = {
  workflows: Workflow[];
  highlightedPage?: string | null;
  publicFlow?: PublicFlowPage[];
};

type WorkflowNodeData = {
  label: string;
  description: string;
  page: string | null;
  workflowName: string;
  stepType: string;
  isHighlighted: boolean;
  isDimmed: boolean;
};

type PublicFlowNodeData = {
  label: string;
  description: string;
};

function CustomPillEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
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
      borderRadius: 12,
      offset: 70,
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
    condition.includes("fail");

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          strokeWidth: 2.5,
          stroke: color,
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

function WorkflowNode({
  data,
}: {
  data: WorkflowNodeData;
}) {
  const stepType =
    data.stepType.toLowerCase();

  const isDecision = stepType === "decision";
  const isSuccess = stepType === "success";
  const isFailure = stepType === "failure";
  const isAlternative = stepType === "alternative";

  if (isDecision) {
    return (
      <div
        className={[
          "relative flex h-28 w-28 items-center justify-center transition-all duration-150",
          data.isDimmed
            ? "opacity-30"
            : "opacity-100",
        ].join(" ")}
      >
        <Handle
          type="target"
          position={Position.Left}
          className="!h-2.5 !w-2.5 !border-2 !border-gray-300 !bg-white"
        />

        <div
          className={[
            "flex h-20 w-20 rotate-45 items-center justify-center border-2 bg-amber-50 shadow-sm transition-transform hover:scale-105",
            data.isHighlighted
              ? "border-sky-500 ring-2 ring-sky-300 ring-offset-2"
              : "border-amber-300",
          ].join(" ")}
        >
          <span className="-rotate-45 px-2 text-center text-[10px] font-semibold leading-tight text-amber-900">
            {data.label}
          </span>
        </div>

        <Handle
          type="source"
          position={Position.Right}
          className="!h-2.5 !w-2.5 !border-2 !border-gray-300 !bg-white"
        />
      </div>
    );
  }

  return (
    <div
      className={[
        "group relative flex min-h-[160px] w-[220px] flex-col justify-between rounded-xl border bg-white p-4 shadow-sm",
        "transition-all duration-150 hover:shadow-md",
        isSuccess
          ? "border-emerald-200"
          : isFailure
            ? "border-red-200"
            : isAlternative
              ? "border-purple-200"
              : "border-gray-200",
        data.isHighlighted
          ? "border-sky-500 shadow-lg ring-2 ring-sky-300 ring-offset-2"
          : "",
        data.isDimmed
          ? "opacity-30"
          : "opacity-100",
      ].join(" ")}
    >
      <Handle
        type="target"
        position={Position.Left}
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

        <h4 className="text-xs font-semibold leading-snug text-gray-900">
          {data.label}
        </h4>

        {data.description && (
          <p className="mt-1.5 line-clamp-3 text-[11px] leading-normal text-gray-500">
            {data.description}
          </p>
        )}
      </div>

      <div className="mt-2 border-t border-gray-100 pt-1.5">
        <span
          className={[
            "block truncate text-[10px] font-medium",
            data.isHighlighted
              ? "text-sky-600"
              : "text-purple-600",
          ].join(" ")}
        >
          {data.page || data.workflowName}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-gray-300 !bg-white"
      />
    </div>
  );
}

function PublicFlowNode({
  data,
}: {
  data: PublicFlowNodeData;
}) {
  return (
    <div className="relative w-[240px] rounded-xl border border-[#C65D3A]/25 bg-white p-4 shadow-sm">
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-[#C65D3A] !bg-white"
      />

      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C65D3A]/10 text-[#C65D3A]">
          <FiExternalLink className="h-3.5 w-3.5" />
        </div>

        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#C65D3A]">
            Public flow
          </p>

          <h4 className="truncate text-xs font-semibold text-gray-900">
            {data.label}
          </h4>
        </div>
      </div>

      {data.description && (
        <p className="text-[11px] leading-relaxed text-gray-500">
          {data.description}
        </p>
      )}
    </div>
  );
}

const nodeTypes = {
  workflow: WorkflowNode,
  publicFlow: PublicFlowNode,
};

const edgeTypes = {
  customPill: CustomPillEdge,
};

/*
 * Layout spacing
 *
 * These are intentionally generous so:
 * - actor workflow cards do not sit on top of each other
 * - branches have enough vertical separation
 * - connections have enough horizontal distance to route cleanly
 */
const MAX_COLS_PER_ROW = 3;
const COLUMN_GAP = 600;
const ROW_LANE_GAP = 500;
const BRANCH_GAP = 280;

const EDGE_COLORS = [
  "#0284c7",
  "#16a34a",
  "#9333ea",
  "#d97706",
];

function buildWorkflowLayout(
  workflow: Workflow,
  highlightedPage: string | null | undefined,
  startOffsetY: number,
) {
  const steps = [...(workflow.steps || [])].sort(
    (a, b) =>
      (a.stepOrder ?? 0) -
      (b.stepOrder ?? 0),
  );

  if (!steps.length) {
    return {
      nodes: [],
      edges: [],
      nextOffsetY:
        startOffsetY + ROW_LANE_GAP,
    };
  }

  const stepIdMap = new Map<
    string,
    string
  >();

  steps.forEach((step, index) => {
    stepIdMap.set(
      String(step.id),
      String(step.id),
    );

    stepIdMap.set(
      `step-${index + 1}`,
      String(step.id),
    );
  });

  const incoming = new Map<
    string,
    string[]
  >();

  const outgoing = new Map<
    string,
    string[]
  >();

  steps.forEach((step) => {
    const id = String(step.id);

    incoming.set(id, []);
    outgoing.set(id, []);
  });

  const validConnections =
    workflow.connections?.filter(
      (connection) => {
        const sourceId = stepIdMap.get(
          String(connection.sourceStepId),
        );

        const targetId = stepIdMap.get(
          String(connection.targetStepId),
        );

        return (
          sourceId &&
          targetId &&
          sourceId !== targetId
        );
      },
    ) || [];

  validConnections.forEach(
    (connection) => {
      const sourceId = stepIdMap.get(
        String(connection.sourceStepId),
      );

      const targetId = stepIdMap.get(
        String(connection.targetStepId),
      );

      if (!sourceId || !targetId) {
        return;
      }

      outgoing
        .get(sourceId)
        ?.push(targetId);

      incoming
        .get(targetId)
        ?.push(sourceId);
    },
  );

  /*
   * If the backend has not generated connections,
   * use step order only as a visual fallback.
   */
  if (!validConnections.length) {
    steps.forEach((step, index) => {
      if (index === 0) return;

      const previous =
        String(steps[index - 1].id);

      const current =
        String(step.id);

      outgoing
        .get(previous)
        ?.push(current);

      incoming
        .get(current)
        ?.push(previous);
    });
  }

  /*
   * Calculate graph levels.
   *
   * A level represents how far a step is from
   * the beginning of the workflow.
   */
  const levels = new Map<
    string,
    number
  >();

  const queue: string[] = [];

  steps.forEach((step) => {
    const id = String(step.id);

    if (
      !(incoming.get(id)?.length)
    ) {
      levels.set(id, 0);
      queue.push(id);
    }
  });

  /*
   * Safety fallback in case the graph has a cycle.
   */
  if (!queue.length) {
    steps.forEach((step) => {
      const id = String(step.id);

      levels.set(
        id,
        Math.max(
          0,
          (step.stepOrder ?? 1) - 1,
        ),
      );
    });
  } else {
    let queueIndex = 0;

    while (queueIndex < queue.length) {
      const current =
        queue[queueIndex++];

      const currentLevel =
        levels.get(current) ?? 0;

      const children =
        outgoing.get(current) || [];

      children.forEach((child) => {
        const proposedLevel =
          currentLevel + 1;

        const existing =
          levels.get(child);

        if (
          existing === undefined ||
          proposedLevel > existing
        ) {
          levels.set(
            child,
            proposedLevel,
          );
        }

        if (
          !queue.includes(child)
        ) {
          queue.push(child);
        }
      });
    }
  }

  /*
   * Make sure every step has a level.
   */
  steps.forEach((step) => {
    const id = String(step.id);

    if (!levels.has(id)) {
      levels.set(
        id,
        Math.max(
          0,
          (step.stepOrder ?? 1) - 1,
        ),
      );
    }
  });

  const groupedByLevel =
    new Map<number, typeof steps>();

  steps.forEach((step) => {
    const id = String(step.id);

    const level =
      levels.get(id) ?? 0;

    if (!groupedByLevel.has(level)) {
      groupedByLevel.set(
        level,
        [],
      );
    }

    groupedByLevel
      .get(level)!
      .push(step);
  });

  const sortedLevels = Array.from(
    groupedByLevel.keys(),
  ).sort((a, b) => a - b);

  const nodePositions =
    new Map<
      string,
      {
        x: number;
        y: number;
      }
    >();

  const nodes: Node<WorkflowNodeData>[] =
    [];

  sortedLevels.forEach(
    (level) => {
      const row =
        groupedByLevel.get(level) || [];

      const laneIndex = Math.floor(
        level / MAX_COLS_PER_ROW,
      );

      const columnIndex =
        level % MAX_COLS_PER_ROW;

      const posX =
        100 +
        columnIndex * COLUMN_GAP;

      const laneBaseY =
        startOffsetY +
        laneIndex * ROW_LANE_GAP;

      /*
       * Branches in the same graph level
       * are spread vertically instead of
       * sharing the same coordinates.
       */
      const totalBranchHeight =
        (row.length - 1) *
        BRANCH_GAP;

      row.forEach(
        (step, branchIndex) => {
          const id = String(step.id);

          const posY =
            laneBaseY +
            branchIndex * BRANCH_GAP -
            totalBranchHeight / 2;

          nodePositions.set(id, {
            x: posX,
            y: posY,
          });

          const page =
            step.page ||
            step.pageName ||
            null;

          const isHighlighted =
            Boolean(
              highlightedPage &&
              page &&
              page === highlightedPage,
            );

          const isDimmed =
            Boolean(
              highlightedPage &&
              page &&
              page !== highlightedPage,
            );

          nodes.push({
            id,
            type: "workflow",
            position: {
              x: posX,
              y: posY,
            },
            data: {
              label:
                step.title ||
                step.name ||
                `Step ${step.stepOrder ?? branchIndex + 1}`,
              description:
                step.description || "",
              page,
              workflowName:
                workflow.name,
              stepType:
                step.type || "action",
              isHighlighted,
              isDimmed,
            },
          });
        },
      );
    },
  );

  const edges: Edge[] = [];

  /*
   * Use the real backend connections when
   * available. The sequential fallback above
   * only exists to keep an incomplete workflow
   * visually connected.
   */
  const connectionsToRender =
    validConnections.length
      ? validConnections
      : steps
        .slice(1)
        .map((step, index) => ({
          sourceStepId:
            steps[index].id,
          targetStepId:
            step.id,
          condition: "",
        }));

  connectionsToRender.forEach(
    (connection, index) => {
      const sourceId =
        stepIdMap.get(
          String(connection.sourceStepId),
        );

      const targetId =
        stepIdMap.get(
          String(connection.targetStepId),
        );

      if (!sourceId || !targetId) {
        return;
      }

      const sourcePosition =
        nodePositions.get(sourceId);

      const targetPosition =
        nodePositions.get(targetId);

      if (
        !sourcePosition ||
        !targetPosition
      ) {
        return;
      }

      const color =
        EDGE_COLORS[
        index % EDGE_COLORS.length
        ];

      const targetStep = steps.find(
        (step) =>
          String(step.id) ===
          targetId,
      );

      const sourceStep = steps.find(
        (step) =>
          String(step.id) ===
          sourceId,
      );

      const sourcePage =
        sourceStep?.page ||
        sourceStep?.pageName ||
        null;

      const targetPage =
        targetStep?.page ||
        targetStep?.pageName ||
        null;

      const isDimmed =
        Boolean(
          highlightedPage &&
          sourcePage &&
          targetPage &&
          sourcePage !==
          highlightedPage &&
          targetPage !==
          highlightedPage,
        );

      edges.push({
        id: `${workflow.id}-${sourceId}-${targetId}-${index}`,
        source: sourceId,
        target: targetId,
        type: "customPill",
        animated: true,
        label:
          connection.condition ||
          undefined,
        data: {
          color,
          isDimmed,
        },
      });
    },
  );

  const maxLevel =
    sortedLevels.length
      ? Math.max(...sortedLevels)
      : 0;

  const maxLaneIndex = Math.floor(
    maxLevel / MAX_COLS_PER_ROW,
  );

  /*
   * Extra bottom space prevents the next
   * actor workflow from touching this one.
   */
  const nextOffsetY =
    startOffsetY +
    (maxLaneIndex + 1) *
    ROW_LANE_GAP +
    220;

  return {
    nodes,
    edges,
    nextOffsetY,
  };
}

function buildPublicFlowLayout(
  publicFlow: PublicFlowPage[],
  workflows: Workflow[],
) {
  if (!publicFlow.length) {
    return {
      nodes: [],
      edges: [],
    };
  }

  const nodes: Node<PublicFlowNodeData>[] =
    [];

  const edges: Edge[] = [];

  publicFlow.forEach(
    (page, index) => {
      const nodeId =
        `public-flow-${page.id}`;

      const x =
        120 + index * 280;

      const y = 40;

      nodes.push({
        id: nodeId,
        type: "publicFlow",
        position: {
          x,
          y,
        },
        data: {
          label: page.name,
          description:
            page.description ||
            page.purpose ||
            "",
        },
      });

      let targetStepId:
        | string
        | null = null;

      /*
       * Prefer an exact page-name match.
       */
      for (const workflow of workflows) {
        const matchingStep =
          workflow.steps?.find(
            (step) => {
              const stepPage =
                step.page ||
                step.pageName ||
                null;

              return (
                stepPage === page.name
              );
            },
          );

        if (matchingStep) {
          targetStepId = String(
            matchingStep.id,
          );
          break;
        }
      }

      /*
       * If there is no exact page match,
       * connect to the first step so the
       * public flow still has a visual entry.
       */
      if (!targetStepId) {
        const firstWorkflow =
          workflows[0];

        const firstStep =
          firstWorkflow?.steps?.[0];

        if (firstStep) {
          targetStepId = String(
            firstStep.id,
          );
        }
      }

      if (targetStepId) {
        edges.push({
          id: `${nodeId}-${targetStepId}`,
          source: nodeId,
          target: targetStepId,
          type: "customPill",
          animated: true,
          data: {
            color: "#C65D3A",
            isDimmed: false,
          },
        });
      }
    },
  );

  return {
    nodes,
    edges,
  };
}

export default function ActorWorkflowCanvas({
  workflows,
  highlightedPage = null,
  publicFlow = [],
}: ActorWorkflowCanvasProps) {
  const [isMaximized, setIsMaximized] =
    useState(false);

  const reactFlowInstanceRef =
    useRef<
      ReactFlowInstance<
        Node<
          WorkflowNodeData |
          PublicFlowNodeData
        >,
        Edge
      > | null
    >(null);

  const { nodes, edges } = useMemo(() => {
    const allNodes: Node<
      WorkflowNodeData |
      PublicFlowNodeData
    >[] = [];

    const allEdges: Edge[] = [];

    let currentOffsetY =
      publicFlow.length > 0
        ? 230
        : 100;

    workflows.forEach((workflow) => {
      const layout =
        buildWorkflowLayout(
          workflow,
          highlightedPage,
          currentOffsetY,
        );

      allNodes.push(
        ...layout.nodes,
      );

      allEdges.push(
        ...layout.edges,
      );

      currentOffsetY =
        layout.nextOffsetY;
    });

    const publicLayout =
      buildPublicFlowLayout(
        publicFlow,
        workflows,
      );

    allNodes.unshift(
      ...publicLayout.nodes,
    );

    allEdges.unshift(
      ...publicLayout.edges,
    );

    return {
      nodes: allNodes,
      edges: allEdges,
    };
  }, [
    workflows,
    highlightedPage,
    publicFlow,
  ]);

  const handleToggleMaximize =
    useCallback(() => {
      setIsMaximized(
        (current) => !current,
      );

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          reactFlowInstanceRef.current?.fitView(
            {
              padding: 0.2,
              duration: 200,
            },
          );
        });
      });
    }, []);

  useEffect(() => {
    if (!isMaximized) return;

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setIsMaximized(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      document.body.style.overflow =
        "";
    };
  }, [isMaximized]);

  if (
    !workflows.length &&
    !publicFlow.length
  ) {
    return (
      <div className="flex h-full min-h-[520px] items-center justify-center rounded-2xl border border-gray-100 bg-[#fbfbfd]">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">
            No product flow yet
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Generate the product structure or
            workflows to see the product logic
            here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isMaximized && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={
            handleToggleMaximize
          }
        />
      )}

      <div
        className={
          isMaximized
            ? "fixed inset-6 z-50 overflow-hidden rounded-2xl border border-gray-100 bg-[#fbfbfd] shadow-2xl"
            : "relative h-full min-h-[calc(100vh-120px)] overflow-hidden rounded-2xl border border-gray-100 bg-[#fbfbfd]"
        }
      >
        <button
          type="button"
          onClick={
            handleToggleMaximize
          }
          title={
            isMaximized
              ? "Exit full screen"
              : "Full screen"
          }
          className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-700"
        >
          {isMaximized ? (
            <FiMinimize2 className="h-4 w-4" />
          ) : (
            <FiMaximize2 className="h-4 w-4" />
          )}
        </button>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnDoubleClick={false}
          zoomOnScroll={true}
          panOnScroll={false}
          panOnDrag={true}
          panActivationKeyCode="Space"
          preventScrolling={false}
          minZoom={0.1}
          maxZoom={1.5}
          fitView
          fitViewOptions={{
            padding: 0.2,
          }}
          onInit={(instance) => {
            reactFlowInstanceRef.current =
              instance;
          }}
        >
          <Background
            gap={24}
            size={1.5}
            color="#e5e7eb"
          />

          <Controls
            showInteractive={false}
            position="top-left"
            className="right-14 !top-3 w-fit"
          />
        </ReactFlow>
      </div>
    </>
  );
}