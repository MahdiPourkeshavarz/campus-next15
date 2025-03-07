import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { HeroSection } from "@/components/blocks/HeroSection";
import { Card, CardProps } from "@/components/Card";
import { ContentList } from "@/components/ContentList";
import { getContentBySlug } from "@/data/loaders";
import { ArticleProps } from "@/types";
import { formatDate } from "@/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function loader(slug: string) {
  const { data } = await getContentBySlug(slug, "/api/articles");
  const article = data[0];
  if (!article) throw notFound();
  return { article: article as ArticleProps, blocks: article?.blocks };
}

interface ArticleOverviewProps {
  headline: string;
  description: string;
  tableOfContent: { heading: string; linkId: string }[];
}

function ArticleOverview({
  headline,
  description,
  tableOfContent,
}: Readonly<ArticleOverviewProps>) {
  return (
    <div className="article-overview">
      <div className="article-overview__info">
        <h3 className="article-overview__headline">{headline}</h3>
        <p className="article-overview__description">{description}</p>
      </div>
      {tableOfContent && (
        <ul className="article-overview__contents">
          {tableOfContent.map((item, index) => (
            <li key={index}>
              <Link href={`#${item.linkId}`} className="article-overview__link">
                {index + 1}. {item.heading}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const BlogCard = (props: Readonly<CardProps>) => (
  <Card {...props} basePath="blog" />
);

export default async function SingleBlogRoute({ params }: PageProps) {
  const slug = (await params).slug;
  const { article, blocks } = await loader(slug);
  const { title, author, publishedAt, description, image } = article;

  const tableOfContents = blocks?.filter(
    (block: { __component: string }) => block.__component === "blocks.heading"
  );

  return (
    <div>
      <HeroSection
        id={article.id}
        heading={title}
        theme="orange"
        image={image}
        author={author}
        publishedAt={formatDate(publishedAt)}
        darken={true}
      />
      <div className="container">
        <ArticleOverview
          headline={title}
          description={description}
          tableOfContent={tableOfContents}
        />
        <BlockRenderer blocks={blocks} />
        <ContentList
          headline="Featured Articles"
          path="/api/articles"
          component={BlogCard}
          featured={true}
          headlineAlignment="center"
        />
      </div>
    </div>
  );
}
