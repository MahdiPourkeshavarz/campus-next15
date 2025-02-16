import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { getHomePageData } from "@/data/loaders";
import { notFound } from "next/navigation";

export default async function Home() {
  const data = await loader();

  const blocks = data?.blocks || [];

  return <BlockRenderer blocks={blocks} />;
}

async function loader() {
  const data = await getHomePageData();
  if (!data) notFound();
  return { ...data.data };
}
