"use client";

type PublicQuestionOption = {
  value: string;
  label: string;
};

type PublicQuestion = {
  id: number | string;
  question: string;
  reason?: string | null;
  answer?: string | null;
  options: PublicQuestionOption[];
};

type PublicQuestionsProps = {
  questions: PublicQuestion[];
};

export default function PublicQuestions({
  questions,
}: PublicQuestionsProps) {
  const unansweredCount = questions.filter(
    (question) => !question.answer
  ).length;

  const answeredCount =
    questions.length - unansweredCount;

  return (
    <div className="mt-6 space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-6 border-b border-border/60 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-5">
          {/* Header illustration */}
          <div className="relative hidden h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-border bg-[#F7F3EF] sm:flex">
            <div className="absolute -right-5 -top-5 h-14 w-14 rounded-full bg-brand/10" />

            <div className="absolute -bottom-5 -left-3 h-16 w-16 rounded-full border border-brand/15" />

            <div className="absolute left-5 top-5 h-8 w-8 rotate-12 rounded-md border border-brand/35 bg-white/60" />

            <div className="absolute left-[27px] top-[29px] h-1.5 w-1.5 rounded-full bg-brand" />

            <div className="absolute left-[36px] top-[25px] h-1.5 w-1.5 rounded-full bg-brand/40" />

            <div className="absolute left-[32px] top-[37px] h-1.5 w-1.5 rounded-full bg-brand/60" />
          </div>

          <div>
            <h2 className="text-xl font-semibold tracking-tight text-main">
              Questions
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
              Decisions and uncertainties that still need clarification
              before the product model can become more complete.
            </p>
          </div>
        </div>

        {/* Status */}
        {questions.length > 0 && (
          <div className="flex items-center gap-4 text-xs text-muted">
            <span>
              <span className="font-semibold text-main">
                {unansweredCount}
              </span>{" "}
              open
            </span>

            <span className="h-3 w-px bg-border" />

            <span>
              <span className="font-semibold text-main">
                {answeredCount}
              </span>{" "}
              resolved
            </span>
          </div>
        )}
      </div>

      {/* Questions */}
      <section>
        {questions.length > 0 ? (
          <div className="border-border/60">
            {questions.map((question, index) => {
              const selectedOption =
                question.options.find(
                  (option) =>
                    option.value === question.answer
                );

              const isAnswered =
                Boolean(question.answer);

              return (
                <div
                  key={question.id}
                  className={`group border-b border-border/60 py-7 transition-colors ${
                    isAnswered
                      ? "opacity-75 hover:opacity-100"
                      : ""
                  }`}
                >
                  <div className="grid grid-cols-[36px_minmax(0,1fr)] gap-4 sm:grid-cols-[52px_minmax(0,1fr)_120px] sm:gap-6">
                    {/* Number */}
                    <div className="pt-0.5">
                      <span
                        className={`text-sm font-bold tabular-nums ${
                          isAnswered
                            ? "text-muted"
                            : "text-brand"
                        }`}
                      >
                        {index + 1}
                      </span>
                    </div>

                    {/* Main content */}
                    <div className="min-w-0">
                      <div className="max-w-3xl">
                        <p className="text-sm font-bold leading-6 text-main">
                          {question.question}
                        </p>

                        {question.reason && (
                          <p className="mt-2.5 max-w-2xl text-xs leading-5 text-muted">
                            {question.reason}
                          </p>
                        )}
                      </div>

                      {/* Answered */}
                      {isAnswered ? (
                        <div className="mt-5 border-l-2 border-brand/20 pl-4">
                          <p className="text-[10px] font-semibold text-muted">
                            Decision
                          </p>

                          <p className="mt-1.5 text-sm font-medium text-main">
                            {selectedOption?.label ??
                              question.answer}
                          </p>
                        </div>
                      ) : (
                        /* Unanswered options — display only */
                        question.options.length > 0 && (
                          <div className="mt-6 max-w-2xl">
                            <div className="mb-2.5 flex items-center justify-between">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                                Options considered
                              </p>

                              <span className="text-[10px] text-muted">
                                {question.options.length}{" "}
                                {question.options.length === 1
                                  ? "option"
                                  : "options"}
                              </span>
                            </div>

                            <div className="grid gap-2 sm:grid-cols-2">
                              {question.options.map(
                                (option) => (
                                  <div
                                    key={option.value}
                                    className="relative flex min-h-12 items-center justify-between border border-border bg-surface px-4 py-3"
                                  >
                                    <span className="pr-4 text-xs font-medium leading-5 text-main">
                                      {option.label}
                                    </span>

                                    <span className="h-4 w-4 shrink-0 rounded-full border border-border" />
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    {/* Status */}
                    <div className="hidden justify-end pt-0.5 sm:flex">
                      {isAnswered ? (
                        <span className="text-[10px] font-medium text-muted">
                          Resolved
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-brand">
                          Open
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="relative overflow-hidden border border-dashed border-border py-16">
            <div className="mx-auto flex max-w-sm flex-col items-center text-center">
              {/* Empty illustration */}
              <div className="relative mb-6 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-border bg-[#F7F3EF]">
                <div className="absolute -right-5 -top-5 h-14 w-14 rounded-full bg-brand/10" />

                <div className="absolute -bottom-6 -left-2 h-16 w-16 rounded-full border border-brand/15" />

                <div className="relative h-9 w-12 rotate-[-5deg] rounded-md border border-brand/35 bg-white/70">
                  <div className="absolute left-2 top-2 h-1 w-5 rounded-full bg-brand/30" />

                  <div className="absolute left-2 top-5 h-1 w-7 rounded-full bg-brand/15" />
                </div>
              </div>

              <h3 className="text-sm font-semibold text-main">
                No open questions
              </h3>

              <p className="mt-2 max-w-xs text-xs leading-5 text-muted">
                Unfold has not identified any unresolved product
                decisions yet.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}