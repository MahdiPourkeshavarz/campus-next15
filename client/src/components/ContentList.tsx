/* eslint-disable @typescript-eslint/no-unused-vars */
import { getContent } from "@/data/loaders";
import { ArticleProps } from "@/types";

interface ContentListProps {
  headline: string;
  query?: string;
  path: string;
  featured?: boolean;
  component: React.ComponentType<ArticleProps & { basePath: string }>;
  headlineAlignment?: "center" | "right" | "left";
}

async function loader(path: string) {
  const { data, meta } = await getContent(path);
  return {
    articles: (data as ArticleProps[]) || [],
  };
}

export async function ContentList({
  headline,
  path,
  component,
  headlineAlignment,
}: Readonly<ContentListProps>) {
  const { articles } = await loader(path);
  const Component = component;
  return (
    <section className="content-items container">
      <h3 className={`content-items__headline ${headlineAlignment ?? ""}`}>
        {headline || "Featured Articles"}
      </h3>
      <div className="content-items__container--card">
        {articles.map((article) => (
          <Component key={article.documentId} {...article} basePath={path} />
        ))}
      </div>
    </section>
  );
}
