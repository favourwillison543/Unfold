"use client";

import React from "react";
import Link from "next/link";
import { FiArrowUpRight, FiFolder } from "react-icons/fi";

import { Project } from "@/types/project";

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({
  project,
}: ProjectCardProps) {
  const lastEdited = new Date(project.updatedAt).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <Link
      href={`/project/${project.id}`}
      className="group relative flex min-h-[230px] flex-col overflow-hidden rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
    >
      {/* Top */}
      <div className="flex items-start justify-between">
        <div className="flex h-6 w-6 items-center justify-center rounded-md border border-brand/15 text-brand">
          <FiFolder size={14} className="font-extrabold"/>
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-lg text-muted opacity-0 transition-all group-hover:bg-background group-hover:text-main group-hover:opacity-100">
          <FiArrowUpRight size={16} />
        </div>
      </div>

      {/* Content */}
      <div className="mt-8">
        <h3 className="text-[17px] font-semibold tracking-tight text-main transition-colors group-hover:text-brand">
          {project.name}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
          {project.description || "No description yet."}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-7">
        <div className="border-t border-border pt-4">
          <p className="text-[11px] font-medium text-muted">
            Edited {lastEdited}
          </p>
        </div>
      </div>
    </Link>
  );
}