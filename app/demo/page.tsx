import Demo from "@/components/demo/Demo";
import { getHumeAccessToken } from "@/utils/getHumeAccessToken";

export default async function DemoPage() {
  const accessToken = await getHumeAccessToken();

  if (!accessToken) {
    throw new Error();
  }

  return <Demo accessToken={accessToken} />;
}
