import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { BlogCard } from "@/components/BlogCard";
import { ContentList } from "@/components/ContentList";
import { getHomePageData } from "@/data/loaders";
import { notFound } from "next/navigation";

export default async function Home() {
  const data = await loader();

  const blocks = data?.blocks || [];

  return (
    <div>
      <BlockRenderer blocks={blocks} />
      <div className="container">
        <ContentList
          headline="featured articles"
          path="/api/articles"
          component={BlogCard}
          featured
          showSearch
        />
      </div>
    </div>
  );
}

async function loader() {
  const data = await getHomePageData();
  if (!data) notFound();
  return { ...data.data };
}
