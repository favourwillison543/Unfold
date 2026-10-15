"use client";

type PublicTab =
  | "overview"
  | "people"
  | "questions"
  | "workflows"
  | "challenges";

type PublicProjectTabsProps = {
  activeTab: PublicTab;
  onTabChange: (tab: PublicTab) => void;
  questionCount?: number;
};

export default function PublicProjectTabs({
  activeTab,
  onTabChange,
  questionCount = 0,
}: PublicProjectTabsProps) {
  const tabs: {
    key: PublicTab;
    label: string;
    count?: number;
  }[] = [
    {
      key: "overview",
      label: "Overview",
    },
    {
      key: "people",
      label: "People & Roles",
    },
    {
      key: "questions",
      label: "Questions",
      count: questionCount,
    },
    {
      key: "workflows",
      label: "Workflows",
    },
    {
      key: "challenges",
      label: "Challenges",
    },
  ];

  return (
    <div className="flex items-center gap-6 overflow-x-auto border-b border-neutral-200 text-sm font-medium">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-0 py-3 transition-colors ${
              isActive
                ? "border-[#C65D3A] text-[#C65D3A]"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <span>{tab.label}</span>

            {tab.count !== undefined && (
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] ${
                  isActive
                    ? "bg-[#C65D3A]/10 text-[#C65D3A]"
                    : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}