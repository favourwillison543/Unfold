"use client";

type TabKey =
  | "overview"
  | "people"
  | "questions"
  | "workflows"
  | "challenges"
  | "team";

type ProjectTabsProps = {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  questionCount?: number;
};

export default function ProjectTabs({
  activeTab,
  onTabChange,
  questionCount = 2,
}: ProjectTabsProps) {
  const tabs: {
    key: TabKey;
    label: string;
    count?: number;
  }[] = [
    { key: "overview", label: "Overview" },
    { key: "people", label: "People & Roles" },
    {
      key: "questions",
      label: "Questions",
      count: questionCount,
    },
    { key: "workflows", label: "Workflows" },
    { key: "challenges", label: "Challenges" },
    { key: "team", label: "Team" },
  ];

  return (
    <div className="flex items-center gap-6 overflow-x-auto border-b border-border py-2 text-sm font-medium">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex items-center gap-2 whitespace-nowrap pb-3 -mb-2 transition-colors ${
              isActive
                ? "border-b-2 border-brand font-semibold text-brand"
                : "text-muted hover:text-main"
            }`}
          >
            <span>{tab.label}</span>

            {tab.count !== undefined && (
              <span className="rounded-full border border-border bg-surface px-2 py-0.5 text-xs text-muted">
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}