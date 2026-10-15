import WorkflowDetailPage from "@/components/projectdetails/main";

type PageProps = {
  params: Promise<{
    projectid: string;
    workflowid: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { projectid, workflowid } = await params;

  return (
    <WorkflowDetailPage
      projectId={Number(projectid)}
      workflowId={Number(workflowid)}
    />
  );
}