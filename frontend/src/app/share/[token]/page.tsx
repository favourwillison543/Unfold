import PublicProjectView from "@/components/publicshare/publicProjectView";

type PageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function Page({
  params,
}: PageProps) {
  const { token } = await params;

  return <PublicProjectView token={token} />;
}