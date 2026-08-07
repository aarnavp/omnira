import { DeviceDetail } from "@/components/dashboard/device-detail";

export default async function DeviceDetailPage(props: PageProps<"/dashboard/devices/[id]">) {
  const { id } = await props.params;
  return <DeviceDetail deviceId={id} />;
}
