"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  FiArrowRight,
  FiMoreHorizontal,
  FiTrash2,
  FiX,
  FiShare2,
  FiCopy,
  FiCheck,
} from "react-icons/fi";

import { Container } from "@/components/ui/container";

import ProjectTabs from "@/components/projectdetails/projectTabs";

import {
  useProject,
  useProjectAnalysis,
  useProjectQuestions,
  useProjectGoals,
  useDeleteProject,
} from "@/hooks/useProject";

import {
  usePublicShare,
  useEnablePublicSharing,
  useDisablePublicSharing,
} from "@/hooks/usePublicSharing";

import OverviewTab from "@/components/projectdetails/overviewTab";
import PeopleRolesTab from "@/components/projectdetails/peopleRolesTab";
import QuestionsTab from "@/components/projectdetails/questionsTab";
import WorkflowsTab from "@/components/projectdetails/workflowsTab";
import ChallengesTab from "@/components/projectdetails/challengesTab";
import LoadingScreen from "@/components/ui/LoadingScreen";
import TeamTab from "@/components/projectdetails/teamTab";

type ActiveTab =
  | "overview"
  | "people"
  | "questions"
  | "workflows"
  | "challenges"
  | "team";

export default function ProjectDetailsView() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const projectId = Number(params.id);

  const [activeTab, setActiveTab] =
    useState<ActiveTab>("overview");

  const [showMenu, setShowMenu] = useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [showShareMenu, setShowShareMenu] =
    useState(false);

  const [copied, setCopied] = useState(false);

  const {
    data: project,
    isLoading: projectLoading,
  } = useProject(projectId);

  const {
    data: analysis,
    isLoading: analysisLoading,
  } = useProjectAnalysis(projectId);

  const {
    data: projectQuestions,
  } = useProjectQuestions(projectId);

  useProjectGoals(projectId);

  const deleteProject = useDeleteProject();

  const {
    data: publicShare,
    isLoading: publicShareLoading,
  } = usePublicShare(projectId);

  const enablePublicSharing =
    useEnablePublicSharing();

  const disablePublicSharing =
    useDisablePublicSharing();

  useEffect(() => {
    const tab = searchParams.get("tab");

    if (
      tab === "overview" ||
      tab === "people" ||
      tab === "questions" ||
      tab === "workflows" ||
      tab === "challenges" ||
      tab === "team"
    ) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  if (projectLoading || analysisLoading) {
    return (
      <div className="w-full pb-16">
        <Container>
          <LoadingScreen />
        </Container>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="w-full pb-16">
        <Container>
          <div className="py-16">
            <p className="text-sm text-neutral-500">
              Project analysis not found.
            </p>
          </div>
        </Container>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="w-full pb-16">
        <Container>
          <div className="py-16">
            <p className="text-sm text-neutral-500">
              Project not found.
            </p>
          </div>
        </Container>
      </div>
    );
  }

  const handleDelete = () => {
    deleteProject.mutate(projectId, {
      onSuccess: () => {
        setShowDeleteModal(false);
        setShowMenu(false);
        router.push("/projects");
      },
    });
  };

  const handleEnableSharing = () => {
    enablePublicSharing.mutate(projectId);
  };

  const handleDisableSharing = () => {
    disablePublicSharing.mutate(projectId);
  };

  const handleCopyLink = async () => {
    if (!publicShare?.url) {
      return;
    }

    await navigator.clipboard.writeText(
      publicShare.url,
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="w-full pb-16 pt-16">
      <Container>
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center gap-2 text-sm text-neutral-500">
          <Link
            href="/projects"
            className="hover:text-neutral-900"
          >
            Projects
          </Link>

          <span>/</span>

          <span className="text-neutral-900">
            {project.name}
          </span>
        </div>

        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-start">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
              {project.name}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500 line-clamp-4">
              {project.description ||
                "No description provided."}
            </p>
          </div>

          <div className="relative flex items-center gap-2">
            {/* Continue refining */}
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-[#C65D3A] px-4 py-2 text-sm font-medium text-white"
            >
              Continue refining
              <FiArrowRight size={15} />
            </button>

            {/* Share */}
            <button
              type="button"
              onClick={() =>
                setShowShareMenu((value) => !value)
              }
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <FiShare2 size={15} />
              Share
            </button>

            {/* Share menu */}
            {showShareMenu && (
              <div className="absolute right-12 top-11 z-40 w-80 rounded-xl border border-neutral-200 bg-white p-4 shadow-lg">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900">
                    Share project
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-neutral-500">
                    Create a public read-only link that anyone
                    with the link can view.
                  </p>
                </div>

                {publicShareLoading ? (
                  <div className="mt-4 text-sm text-neutral-500">
                    Checking sharing status...
                  </div>
                ) : publicShare?.enabled &&
                  publicShare.url ? (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2">
                      <p className="min-w-0 flex-1 truncate text-xs text-neutral-600">
                        {publicShare.url}
                      </p>

                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-neutral-500 hover:bg-white hover:text-neutral-900"
                        aria-label="Copy public link"
                      >
                        {copied ? (
                          <FiCheck size={15} />
                        ) : (
                          <FiCopy size={15} />
                        )}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleDisableSharing}
                      disabled={
                        disablePublicSharing.isPending
                      }
                      className="mt-3 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {disablePublicSharing.isPending
                        ? "Disabling..."
                        : "Disable public link"}
                    </button>
                  </div>
                ) : (
                  <div className="mt-4">
                    <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-3">
                      <p className="text-sm font-medium text-neutral-900">
                        Public sharing is off
                      </p>

                      <p className="mt-1 text-xs leading-5 text-neutral-500">
                        Anyone with the link will be able to
                        view this project without editing it.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleEnableSharing}
                      disabled={
                        enablePublicSharing.isPending
                      }
                      className="mt-3 w-full rounded-lg bg-[#C65D3A] px-3 py-2 text-sm font-medium text-white hover:bg-[#b65232] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {enablePublicSharing.isPending
                        ? "Creating link..."
                        : "Create public link"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* More options */}
            <button
              type="button"
              onClick={() =>
                setShowMenu((value) => !value)
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50"
              aria-label="More options"
            >
              <FiMoreHorizontal size={18} />
            </button>

            {/* Dropdown menu */}
            {showMenu && (
              <div className="absolute right-0 top-11 z-30 w-48 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    setShowDeleteModal(true);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  <FiTrash2 size={16} />
                  Delete project
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <ProjectTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          questionCount={
            projectQuestions?.length ?? 0
          }
        />

        {/* Overview */}
        {activeTab === "overview" && (
          <OverviewTab analysis={analysis} />
        )}

        {/* People */}
        {activeTab === "people" && (
          <PeopleRolesTab analysis={analysis} />
        )}

        {/* Questions */}
        {activeTab === "questions" && (
          <QuestionsTab analysis={analysis} />
        )}

        {/* Workflows */}
        {activeTab === "workflows" && (
          <WorkflowsTab
            analysis={analysis}
            projectId={projectId}
          />
        )}

        {/* Challenges */}
        {activeTab === "challenges" && (
          <ChallengesTab
            analysis={analysis}
            projectId={projectId}
          />
        )}

        {/* Team */}
        {activeTab === "team" && (
          <TeamTab projectId={projectId} />
        )}

        {/* Delete confirmation modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
              {/* Modal header */}
              <div className="flex items-start justify-between border-b border-neutral-100 px-6 py-5">
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Delete project?
                  </h2>

                  <p className="mt-1 text-sm leading-5 text-neutral-500">
                    This action cannot be undone.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowDeleteModal(false)
                  }
                  disabled={deleteProject.isPending}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Close"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Modal content */}
              <div className="px-6 py-6">
                <p className="text-sm leading-6 text-neutral-600">
                  You are about to permanently delete:
                </p>

                <div className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
                  <p className="text-sm font-medium text-neutral-900">
                    {project.name}
                  </p>
                </div>

                <p className="mt-4 text-sm leading-6 text-neutral-500">
                  All data associated with this project will
                  be removed.
                </p>
              </div>

              {/* Modal actions */}
              <div className="flex items-center justify-end gap-3 border-t border-neutral-100 px-6 py-4">
                <button
                  type="button"
                  onClick={() =>
                    setShowDeleteModal(false)
                  }
                  disabled={deleteProject.isPending}
                  className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteProject.isPending}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FiTrash2 size={15} />

                  {deleteProject.isPending
                    ? "Deleting..."
                    : "Delete project"}
                </button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}