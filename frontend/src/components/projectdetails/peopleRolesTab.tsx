"use client";

import React, { useState } from "react";

import {
  FiCheck,
  FiChevronRight,
  FiUsers,
} from "react-icons/fi";

import { Analysis } from "@/types/project";

type PeopleRolesTabProps = {
  analysis: Analysis;
};

type PersonaId = string | number | null;

export default function PeopleRolesTab({
  analysis,
}: PeopleRolesTabProps) {
  const [activePersonaId, setActivePersonaId] =
    useState<PersonaId>(analysis.people?.[0]?.id ?? null);

  if (!analysis.people || analysis.people.length === 0) {
    return (
      <div className="mt-6">
        <div className="relative overflow-hidden border border-dashed border-border py-16">
          <div className="mx-auto flex max-w-sm flex-col items-center text-center">
            <div className="relative mb-6 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-border bg-[#F7F3EF]">
              <div className="absolute -right-5 -top-5 h-14 w-14 rounded-full bg-brand/10" />
              <div className="absolute -bottom-6 -left-2 h-16 w-16 rounded-full border border-brand/15" />

              <div className="relative flex -space-x-2">
                <div className="h-7 w-7 rounded-full border-2 border-white bg-brand/20" />
                <div className="h-7 w-7 rounded-full border-2 border-white bg-brand/35" />
                <div className="h-7 w-7 rounded-full border-2 border-white bg-brand/15" />
              </div>
            </div>

            <h3 className="text-sm font-semibold text-main">
              No people or roles identified yet
            </h3>

            <p className="mt-2 max-w-xs text-xs leading-5 text-muted">
              Once the product is analyzed, the people and
              organizations interacting with it will appear here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const activePerson =
    analysis.people.find(
      (person) => person.id === activePersonaId,
    ) ?? analysis.people[0];

  const totalResponsibilities = analysis.people.reduce(
    (total, person) =>
      total + (person.responsibilities?.length || 0),
    0,
  );

  return (
    <div className="mt-6 space-y-10 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-6 border-b border-border/60 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-5">
          {/* Header illustration */}
          <div className="relative hidden h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-border bg-[#F7F3EF] sm:flex">
            <div className="absolute -right-4 -top-4 h-14 w-14 rounded-full bg-brand/10" />
            <div className="absolute -bottom-6 -left-4 h-16 w-16 rounded-full border border-brand/15" />

            <div className="absolute left-5 top-5 flex -space-x-2">
              <div className="h-7 w-7 rounded-full border-2 border-[#F7F3EF] bg-brand/20" />
              <div className="h-7 w-7 rounded-full border-2 border-[#F7F3EF] bg-brand/40" />
              <div className="h-7 w-7 rounded-full border-2 border-[#F7F3EF] bg-brand/15" />
            </div>

            <div className="absolute bottom-4 left-6 h-1.5 w-8 rounded-full bg-brand/20" />
            <div className="absolute bottom-4 right-5 h-1.5 w-4 rounded-full bg-brand/10" />
          </div>

          <div>
            <h2 className="text-xl font-semibold tracking-tight text-main">
              People & Roles
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
              The people and organizations that interact with the
              product, and what the product expects from them.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted">
          <span>
            <span className="font-semibold text-main">
              {analysis.people.length}
            </span>{" "}
            {analysis.people.length === 1 ? "role" : "roles"}
          </span>

          <span className="h-3 w-px bg-border" />

          <span>
            <span className="font-semibold text-main">
              {totalResponsibilities}
            </span>{" "}
            {totalResponsibilities === 1
              ? "responsibility"
              : "responsibilities"}
          </span>
        </div>
      </div>

      {/* People */}
      <section>
        <div className="border-b border-border/60 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-main">
                Roles in the product
              </h3>

              <p className="mt-1 text-xs leading-5 text-muted">
                Select a role to inspect its responsibilities.
              </p>
            </div>

            <FiUsers className="h-4 w-4 text-muted" />
          </div>
        </div>

        <div className="border-b border-border/60">
          {analysis.people.map((person, index) => {
            const isActive = activePerson.id === person.id;
            const count = person.responsibilities?.length || 0;

            return (
              <button
                key={person.id}
                type="button"
                onClick={() => setActivePersonaId(person.id)}
                className={`group grid w-full grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-4 border-b border-border/60 py-5 text-left transition-colors last:border-b-0 sm:grid-cols-[52px_minmax(0,1fr)_160px_auto] sm:gap-6 ${
                  isActive
                    ? "bg-brand/[0.025]"
                    : "hover:bg-brand/[0.018]"
                }`}
              >
                <span
                  className={`text-sm font-bold tabular-nums ${
                    isActive ? "text-brand" : "text-muted"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p
                      className={`text-sm leading-6 ${
                        isActive
                          ? "font-semibold text-main"
                          : "font-medium text-main"
                      }`}
                    >
                      {person.name}
                    </p>

                    {person.type && (
                      <span className="text-[10px] font-medium text-muted">
                        {person.type}
                      </span>
                    )}
                  </div>

                  {person.description && (
                    <p className="mt-1 max-w-2xl truncate text-xs leading-5 text-muted">
                      {person.description}
                    </p>
                  )}
                </div>

                <div className="hidden justify-end sm:flex">
                  <span className="text-[10px] font-medium text-muted">
                    {count}{" "}
                    {count === 1
                      ? "responsibility"
                      : "responsibilities"}
                  </span>
                </div>

                <FiChevronRight
                  className={`h-4 w-4 transition-transform ${
                    isActive
                      ? "translate-x-0.5 text-brand"
                      : "text-border group-hover:text-muted"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </section>

      {/* Active role */}
      <section>
        <div className="border-b border-border/60 pb-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/5 text-brand">
              <FiUsers className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-semibold tracking-tight text-main">
                  {activePerson.name}
                </h3>

                {activePerson.type && (
                  <span className="border border-border px-2 py-0.5 text-[10px] font-medium text-muted">
                    {activePerson.type}
                  </span>
                )}
              </div>

              {activePerson.description && (
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                  {activePerson.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Responsibilities */}
        <div className="pt-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold text-main">
                Responsibilities
              </h4>

              <p className="mt-1 text-xs leading-5 text-muted">
                What this role is expected to do within the product.
              </p>
            </div>

            <span className="text-[10px] font-medium text-muted">
              {activePerson.responsibilities?.length || 0} total
            </span>
          </div>

          {activePerson.responsibilities &&
          activePerson.responsibilities.length > 0 ? (
            <div className="mt-5">
              {activePerson.responsibilities.map(
                (responsibility, index) => (
                  <div
                    key={`${activePerson.id}-${index}`}
                    className="group flex items-start gap-4 border-b border-border/60 py-5 first:border-t"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-brand/20 bg-brand/5">
                      <FiCheck
                        className="h-3 w-3 text-brand"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm leading-6 text-main">
                        {responsibility}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="mt-5 border border-dashed border-border py-10 text-center">
              <p className="text-sm font-medium text-main">
                No responsibilities defined yet
              </p>

              <p className="mt-1.5 text-xs leading-5 text-muted">
                This role has been identified, but its expected
                responsibilities have not been defined.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}