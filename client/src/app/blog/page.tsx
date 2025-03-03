/* eslint-disable @typescript-eslint/no-unused-vars */
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { BlogCard } from "@/components/BlogCard";
import { ContentList } from "@/components/ContentList";
import { getPageBySlug } from "@/data/loaders";
import { notFound } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ page?: string; query?: string }>;
}

export default async function BlogRoute({ searchParams }: PageProps) {
  const { blocks } = await loader("blog");
  const { page, query } = await searchParams;

  return (
    <>
      <div className="blog-page">
        <BlockRenderer blocks={blocks} />
        <ContentList
          headline="Check out our latest articles"
          path="/api/articles"
          component={BlogCard}
          showSearch
          query={query}
          showPagination
          page={page}
        />
      </div>
    </>
  );
}

async function loader(slug: string) {
  const { data } = await getPageBySlug(slug);
  if (data.length === 0) notFound();
  return { blocks: data[0]?.blocks };
}
