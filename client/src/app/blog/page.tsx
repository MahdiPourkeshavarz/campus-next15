/* eslint-disable @typescript-eslint/no-unused-vars */
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { Card, CardProps } from "@/components/Card";
import { ContentList } from "@/components/ContentList";
import { getPageBySlug } from "@/data/loaders";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const BlogCard = (props: Readonly<CardProps>) => (
  <Card {...props} basePath="blog" />
);

export default async function BlogRoute({ params }: PageProps) {
  const slug = (await params).slug;

  const { blocks } = await loader(slug);

  return (
    <>
      <div className="blog-page">
        <BlockRenderer blocks={blocks} />
        <ContentList
          headline="Check out our latest articles"
          path="/api/articles"
          component={BlogCard}
        />
      </div>
    </>
  );
}

async function loader(slug: string) {
  const { data } = await getPageBySlug("blog");
  if (data.length === 0) notFound();
  return { blocks: data[0]?.blocks };
}
