import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { getPageBySlug } from "@/data/loaders";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DynamicPageRoute({ params }: PageProps) {
  const slug = (await params).slug;

  const { blocks } = await loader(slug);

  return <BlockRenderer blocks={blocks} />;
}

async function loader(slug: string) {
  const { data } = await getPageBySlug(slug);
  if (data.length === 0) notFound();
  return { blocks: data[0]?.blocks };
}
