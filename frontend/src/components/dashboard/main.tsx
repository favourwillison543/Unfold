"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "../ui/container";
import { useMe } from "@/hooks/auth/useAuth";
import { useProjects } from "@/hooks/useProject";
import { Button } from "../ui/button";
import EmptyState from "./EmptyState";

export default function Dashboard() {
  const router = useRouter();
  const [ideaPrompt, setIdeaPrompt] = useState("");

  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: user, isLoading: userLoading } = useMe();

  const hasProjects = projects.length > 0;
  const firstName = user?.name ? user.name.split(" ")[0] : null;

  const handleUnfold = (e: React.FormEvent) => {
    e.preventDefault();
    const idea = ideaPrompt.trim();
    if (idea) {
      sessionStorage.setItem("unfoldIdea", idea);
    }
    router.push("/project/new");
  };

  if (projectsLoading || userLoading) {
    return (
      <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center">
        <Container>
          <div className="text-center text-sm text-muted">
            Loading your workspace...
          </div>
        </Container>
      </div>
    );
  }

  // State 1: Completely Empty Dashboard
  if (!hasProjects) {
    return (
      <div className="w-full h-[calc(100vh-4rem)] overflow-y-auto">
        <Container>
          <EmptyState />
        </Container>
      </div>
    );
  }

  // State 2: Scrollable Main Content Area
  return (
    <div className="w-full h-[calc(100vh-4rem)] py-6 overflow-hidden">
      <Container className="h-full">
        <main className="w-full h-full overflow-y-auto pr-2 flex flex-col items-center justify-center text-center py-12 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center text-brand mb-6 shrink-0">
            <svg
              className="w-7 h-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18h6" />
              <path d="M10 22h4" />
              <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A5.5 5.5 0 1010 9.5" />
              <path d="M12 3v0a5.5 5.5 0 00-2.5 10.5c.76.76 1.23 1.52 1.41 2.5" />
            </svg>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-main">
            {firstName ? `Welcome back, ${firstName}` : "Unfold a new idea"}
          </h2>

          <p className="mt-2 text-sm text-muted leading-relaxed max-w-sm">
            Describe a rough product idea and we'll help you map the people,
            workflows, and gaps around it.
          </p>

          <div className="mt-8 w-full max-w-md px-2 sm:px-0">
            <form
              onSubmit={handleUnfold}
              className="flex items-center gap-2 bg-surface border border-border rounded-full p-1.5 pl-4 sm:pl-5 shadow-sm focus-within:border-brand/50 transition-colors"
            >
              <input
                type="text"
                value={ideaPrompt}
                onChange={(e) => setIdeaPrompt(e.target.value)}
                placeholder="A marketplace for booking photographers..."
                className="flex-1 min-w-0 text-sm text-main placeholder:text-muted bg-transparent focus:outline-none py-1.5"
              />

              <Button
                type="submit"
                className="bg-brand hover:bg-brand/90 text-white font-medium text-xs sm:text-sm rounded-full px-4 sm:px-6 py-2.5 transition-colors shrink-0"
              >
                Unfold it
              </Button>
            </form>
          </div>
        </main>
      </Container>
    </div>
  );
}