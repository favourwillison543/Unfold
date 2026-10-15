"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { FiArrowUpRight, FiPlus, FiSearch, FiSliders } from "react-icons/fi";

import { useProjects } from "@/hooks/useProject";
import ProjectCard from "@/components/dashboard/ProjectCard";


export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"recent" | "name">("recent");

  const { data: projects = [], isLoading } = useProjects();

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = projects.filter((project) => {
      if (!query) return true;

      return (
        project.name.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query)
      );
    });

    return [...result].sort((a, b) => {
      if (sort === "name") {
        return a.name.localeCompare(b.name);
      }

      return (
        new Date(b.updatedAt).getTime() -
        new Date(a.updatedAt).getTime()
      );
    });
  }, [projects, search, sort]);

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10 lg:py-12">
        {/* Header */}
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
              Workspace
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-main">
              Projects
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
              Turn product ideas into clear, buildable plans.
            </p>
          </div>

          <Link
            href="/project/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand/90"
          >
            <FiPlus size={16} strokeWidth={2} />
            New project
          </Link>
        </header>

        {/* Toolbar */}
        <div className="mt-10 flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <FiSearch
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-main outline-none transition-colors placeholder:text-muted focus:border-brand/50 focus:ring-2 focus:ring-brand/10"
            />
          </div>

          <div className="flex items-center gap-2">
            <FiSliders size={15} className="text-muted" />

            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value as "recent" | "name")
              }
              className="h-9 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-main outline-none focus:border-brand/50"
            >
              <option value="recent">Recently edited</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* Project section */}
        <section className="mt-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-main">
                Your projects
              </h2>

              {!isLoading && (
                <p className="mt-1 text-xs text-muted">
                  {projects.length}{" "}
                  {projects.length === 1 ? "project" : "projects"}
                </p>
              )}
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-56 animate-pulse rounded-2xl border border-border bg-surface"
                />
              ))}
            </div>
          )}

          {/* Projects */}
          {!isLoading && filteredProjects.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                />
              ))}
            </div>
          )}

          {/* No search results */}
          {!isLoading &&
            projects.length > 0 &&
            filteredProjects.length === 0 && (
              <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-6 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-muted">
                  <FiSearch size={17} />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-main">
                  No projects found
                </h3>

                <p className="mt-1 max-w-sm text-sm text-muted">
                  Try a different search term.
                </p>
              </div>
            )}

          {/* Empty state */}
          {!isLoading && projects.length === 0 && (
            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-brand/[0.06] blur-3xl" />

              <div className="relative flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand/20 bg-brand/10 text-brand">
                  <FiPlus size={20} strokeWidth={1.8} />
                </div>

                <h3 className="mt-5 text-base font-semibold text-main">
                  Start with an idea
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-muted">
                  Create your first project and start mapping out the
                  people, workflows, and decisions behind the product.
                </p>

                <Link
                  href="/project/new"
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand/90"
                >
                  Create project
                  <FiArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}