import { DeploymentDetail } from "@/components/dashboard/deployment-detail";

export default async function DeploymentDetailPage(props: PageProps<"/dashboard/deployments/[id]">) {
  const { id } = await props.params;
  return <DeploymentDetail deploymentId={id} />;
}
