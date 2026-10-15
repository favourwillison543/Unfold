
"use client";

import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import Image from "next/image";

import { FiX } from "react-icons/fi";

import Step3Questions from "@/components/newProjects/step3questions";
import Step1Idea from "@/components/newProjects/step1idea";
import Step2Analysis from "@/components/newProjects/step2analysis";
import Step4Goals from "@/components/newProjects/step4goals";
import Step5Generation from "@/components/newProjects/step5generation";

import {
  useCreateProject,
  useCreateAnalysis,
  useGenerateQuestions,
  useGenerateGoalSuggestions,
} from "@/hooks/useProject";

import {
  AnalysisResult,
  GenerateGoalSuggestionsResponse,
  Question,
} from "@/types/project";

function NewProjectContent() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [analysis, setAnalysis] =
    useState<AnalysisResult | null>(null);
  const [projectId, setProjectId] =
    useState<number | null>(null);
  const [types, setTypes] = useState<string[]>([]);
  const [actors, setActors] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [productFormat, setProductFormat] = useState("");
  const [answers, setAnswers] =
    useState<Record<string, string>>({});
  const [goalSuggestions, setGoalSuggestions] =
    useState<GenerateGoalSuggestionsResponse | null>(
      null
    );

  const createProject = useCreateProject();
  const createAnalysis = useCreateAnalysis();
  const generateQuestions = useGenerateQuestions();
  const generateGoalSuggestions =
    useGenerateGoalSuggestions();

  const handleClose = () => {
    router.push("/dashboard");
  };

  useEffect(() => {
    const idea = sessionStorage.getItem("unfoldIdea");

    if (idea) {
      setDescription(idea);
      sessionStorage.removeItem("unfoldIdea");
    }
  }, []);

  const handleStartThinking = async () => {
    if (!productName.trim() || !description.trim()) {
      return;
    }

    try {
      const project = await createProject.mutateAsync({
        name: productName,
        description,
        productFormat,
      });

      const analysisResponse =
        await createAnalysis.mutateAsync(project.id);

      const result = analysisResponse.result;

      setProjectId(project.id);
      setAnalysis(result);
      setTypes(result.productTypes);
      setActors(
        result.actors.map((actor) => actor.name)
      );
      setAreas(
        result.productAreas.map((area) => area.name)
      );
      setStep(2);
    } catch (error) {
      console.error(
        "Failed to start project:",
        error
      );
    }
  };

  const handleGenerateQuestions = async () => {
    if (!projectId || !analysis) {
      return;
    }

    try {
      const result =
        await generateQuestions.mutateAsync({
          projectId,
          body: {
            understanding: analysis.understanding,
            productTypes: types,
            productAreas: analysis.productAreas.map((area) => ({
              name: area.name,
              description: area.description ?? "",
            })),
            actors: analysis.actors,
            productModel: {
              role: "",
              directCustomer: "",
              usageMode: "",
              primaryInterfaces: []
            },
            entities: [],
            relationships: [],
            uncertainties: []
          },
        });

      setQuestions(result.questions);
      setStep(3);
    } catch (error) {
      console.error(
        "Failed to generate questions:",
        error
      );
    }
  };

  const handleFinish = async (
    questionAnswers: Record<string, string>
  ) => {
    if (!projectId || !analysis) {
      return;
    }

    setAnswers(questionAnswers);

    try {
      const answeredQuestions = questions
        .filter(
          (question) =>
            questionAnswers[question.id]?.trim()
        )
        .map((question) => ({
          question: question.question,
          answer:
            questionAnswers[question.id].trim(),
        }));

      const result =
        await generateGoalSuggestions.mutateAsync({
          projectId,
          body: {
            understanding: analysis.understanding,
            productTypes: types,
            productAreas: analysis.productAreas.map((area) => ({
              name: area.name,
              description: area.description ?? "",
            })),
            actors: analysis.actors,
            answers: answeredQuestions,
          },
        });

      setGoalSuggestions(result);
      setStep(4);
    } catch (error) {
      console.error(
        "Failed to generate goal suggestions:",
        error
      );
    }
  };

  const progressPercent = (step / 5) * 100;

  return (
    <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/50 p-4 backdrop-blur-sm duration-200 sm:p-6">
      <div className="relative mx-auto flex max-h-[85vh] w-full max-w-4xl animate-in flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl duration-200 zoom-in-95">
        <div className="flex shrink-0 items-center justify-between p-6 pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-brand/20 bg-brand/10 text-brand">
              <Image
                src="/log.png"
                alt="UnFold logo"
                width={18}
                height={18}
                className="object-contain"
              />
            </div>

            <span className="text-base font-bold tracking-tight text-main">
              UnFold
            </span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-black/[0.05] hover:text-main dark:hover:bg-white/[0.08]"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:p-10">
          {step === 1 && (
            <Step1Idea
              productName={productName}
              setProductName={setProductName}
              description={description}
              setDescription={setDescription}
              productFormat={productFormat}
              setProductFormat={setProductFormat}
              onNext={handleStartThinking}
              isLoading={
                createProject.isPending ||
                createAnalysis.isPending
              }
            />
          )}

          {step === 2 && (
            <Step2Analysis
              understanding={analysis?.understanding ?? ""}
              types={types}
              setTypes={setTypes}
              actors={actors}
              setActors={setActors}
              areas={areas}
              setAreas={setAreas}
              onNext={handleGenerateQuestions}
              isLoading={generateQuestions.isPending} onBack={function (): void {
                throw new Error("Function not implemented.");
              } } />
          )}

          {step === 3 && projectId && (
            <Step3Questions
              projectId={projectId}
              questions={questions}
              onBack={() => setStep(2)}
              onFinish={handleFinish}
            />
          )}

          {step === 4 && goalSuggestions && (
            <Step4Goals
              actorGoals={goalSuggestions.actorGoals}
              onBack={() => setStep(3)}
              onContinue={() => setStep(5)}
            />
          )}

          {step === 5 && projectId && (
            <Step5Generation
              projectId={projectId}
              onComplete={() =>
                router.push(`/project/${projectId}`)
              }
            />
          )}
        </div>

        <div className="shrink-0 border-t border-border/50 bg-surface px-6 py-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/40">
            <div
              className="h-full bg-brand transition-all duration-300 ease-out"
              style={{
                width: `${progressPercent}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewProjectPage() {
  return <NewProjectContent />;
}
