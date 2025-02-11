## Building the ContentList Component in Next.js

ContentList Component:

```tsx
import { ArticleProps } from "@/types";
import { getContent } from "@/data/loaders";

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
```

Article Types:

```ts
export interface ArticleProps {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  image: ImageProps;
  author: string;
  featured: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}
```

Card Component:

```tsx
import { ImageProps } from "@/types";

import Link from "next/link";
import { StrapiImage } from "./StrapiImage";
import { formatDate } from "@/utils/format-date";

export interface CardProps {
  documentId: string;
  title: string;
  description: string;
  slug: string;
  image: ImageProps;
  price?: number;
  startDate?: string;
  createdAt: string;
  basePath: string;
}

export function Card({
  title,
  description,
  slug,
  image,
  price,
  createdAt,
  startDate,
  basePath,
}: Readonly<CardProps>) {
  return (
    <Link href={`/${basePath}/${slug}`} className="content-items__card">
      <div className="content-items__card-img">
        <StrapiImage
          src={image.url}
          alt={image.alternativeText || "No alternative text provided"}
          width={400}
          height={400}}
        />
      </div>
      <div className="content-items__card-text">
        <h5>{title}</h5>
        {price && (
          <p>
            <span>Price: </span>
            {price}
          </p>
        )}
        {(startDate ?? createdAt) && (
          <p>{formatDate(startDate ?? createdAt)}</p>
        )}
        <p>{description.slice(0, 144)}...</p>
      </div>
    </Link>
  );
}
```

Format Date:

```ts
export function formatDate(dateString: string): string {
  try {
    // Parse ISO string to Date object
    const date = dateString ? new Date(dateString) : new Date();

    // Check if date is valid
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date string");
    }

    // Format the date using Intl.DateTimeFormat for more consistent results
    const formatter = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return formatter.format(date);
  } catch (error) {
    console.error(`Error formatting date: ${dateString}`, error);
    return "Invalid date";
  }
}
```

Get Content Loader:

```ts
export async function getContent(path: string) {
  const url = new URL(path, BASE_URL);

  url.search = qs.stringify({
    sort: ["createdAt:desc"],
    populate: {
      image: {
        fields: ["url", "alternativeText"],
      },
    },
  });

  return fetchAPI(url.href, { method: "GET" });
}
```

Add the following in the `app/blog/page.tsx` file.

``` tsx
import { Card, type CardProps } from "@/components/Card";
const BlogCard = (props: Readonly<CardProps>) => <Card {...props} basePath="blog" />;

<ContentList
  headline="Check out our latest articles"
  path="/api/articles"
  component={BlogCard}
/>

```
