"use client";

import { useState } from "react";
import { FiMail, FiSend } from "react-icons/fi";

import { useInviteProjectMember } from "@/hooks/useProjectTeam";

type TeamTabProps = {
  projectId: number;
};

export default function TeamTab({
  projectId,
}: TeamTabProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"viewer" | "editor">(
    "viewer",
  );

  const inviteMember = useInviteProjectMember();

  const handleInvite = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return;
    }

    inviteMember.mutate(
      {
        projectId,
        email: trimmedEmail,
        role,
      },
      {
        onSuccess: () => {
          setEmail("");
          setRole("viewer");
        },
      },
    );
  };

  return (
    <div className="py-8">
      <div className="max-w-3xl">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">
            Project team
          </h2>

          <p className="mt-1 text-sm leading-6 text-neutral-500">
            Invite people to collaborate on this project and
            control what they can access.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-neutral-200 bg-white">
          <div className="border-b border-neutral-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-neutral-900">
              Invite someone
            </h3>

            <p className="mt-1 text-xs leading-5 text-neutral-500">
              They will receive an invitation by email.
            </p>
          </div>

          <div className="p-5">
            <div className="grid gap-4 md:grid-cols-[1fr_150px_auto] md:items-end">
              <div>
                <label
                  htmlFor="team-member-email"
                  className="mb-2 block text-sm font-medium text-neutral-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <FiMail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  />

                  <input
                    id="team-member-email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        email.trim()
                      ) {
                        handleInvite();
                      }
                    }}
                    placeholder="name@example.com"
                    className="h-10 w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="team-member-role"
                  className="mb-2 block text-sm font-medium text-neutral-700"
                >
                  Role
                </label>

                <select
                  id="team-member-role"
                  value={role}
                  onChange={(event) =>
                    setRole(
                      event.target.value as
                        | "viewer"
                        | "editor",
                    )
                  }
                  className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-neutral-400"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleInvite}
                disabled={
                  !email.trim() ||
                  inviteMember.isPending
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#C65D3A] px-4 text-sm font-medium text-white hover:bg-[#b65232] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiSend size={15} />

                {inviteMember.isPending
                  ? "Sending..."
                  : "Send invite"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
            <h3 className="text-sm font-semibold text-neutral-900">
              Viewer
            </h3>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Can view the project and its product analysis,
              workflows, questions, and challenges.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
            <h3 className="text-sm font-semibold text-neutral-900">
              Editor
            </h3>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Editor access is currently read-only, just like
              viewer access. Editing permissions can be expanded
              later without changing the membership structure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}