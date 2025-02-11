## Building Single Blog Detail Page

Creating dynamic route for blog detail page.

- Create a new `page.tsx` file in `app/blog/[slug]`
- Create a new loader function in `app/blog/[slug].tsx`
- Console log the data in the single blog page

`page.tsx` starter code:

```tsx
import type { ArticleProps, Block } from "@/types";
import { notFound } from "next/navigation";
import { formatDate } from "@/utils/format-date";

import { HeroSection } from "@/components/blocks/HeroSection";

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
}

function ArticleOverview({
  headline,
  description,
}: Readonly<ArticleOverviewProps>) {
  return (
    <div className="article-overview">
      <div className="article-overview__info">
        <h3 className="article-overview__headline">{headline}</h3>
        <p className="article-overview__description">{description}</p>
      </div>
    </div>
  );
}
export default async function SingleBlogRoute({ params }: PageProps) {
  const slug = (await params).slug;
  const { article, blocks } = await loader(slug);
  const { title, author, publishedAt, description, image } = article;

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
    </div>
  );
}
```

Now that we have the page, we need to create the loader function to add in `data/loaders.ts` file.

Loader function:

```tsx
const blogPopulate = {
  blocks: {
    on: {
      "blocks.hero-section": {
        populate: {
          image: {
            fields: ["url", "alternativeText"],
          },
          logo: {
            populate: {
              image: {
                fields: ["url", "alternativeText"],
              },
            },
          },
          cta: true,
        },
      },
      "blocks.info-block": {
        populate: {
          image: {
            fields: ["url", "alternativeText"],
          },
          cta: true,
        },
      },
      "blocks.featured-article": {
        populate: {
          image: {
            fields: ["url", "alternativeText"],
          },
          link: true,
        },
      },
      "blocks.subscribe": {
        populate: true,
      },
      "blocks.heading": {
        populate: true,
      },
      "blocks.paragraph-with-image": {
        populate: {
          image: {
            fields: ["url", "alternativeText"],
          },
        },
      },
      "blocks.paragraph": {
        populate: true,
      },
      "blocks.full-image": {
        populate: {
          image: {
            fields: ["url", "alternativeText"],
          },
        },
      },
    },
  },
};

export async function getContentBySlug(slug: string, path: string) {
  const url = new URL(path, BASE_URL);
  url.search = qs.stringify({
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: {
      image: {
        fields: ["url", "alternativeText"],
      },
      ...blogPopulate,
    },
  });

  return fetchAPI(url.href, { method: "GET" });
}

```

Now that we have the loader function, our import statement should now stop throwing error.

Navigate to your front end and you should see the data in the single blog page.

## Building the Table of Contents

We will first filter through the blocks array and find the heading blocks and return them as a list of objects which will be used to create the table of contents.

```tsx
const tableOfContents = blocks?.filter(
  (block: Block) => block.__component === "blocks.heading"
);
```

Now let's modify our `ArticleOverview` component to accept the `tableOfContents` array and render it as a list of links.

```tsx
{
  tableOfContents && (
    <ul className="article-overview__contents">
      {tableOfContents.map((item, index) => (
        <li key={index}>
          <Link href={`#${item.linkId}`} className="article-overview__link">
            {index + 1}. {item.heading}
          </Link>
        </li>
      ))}
    </ul>
  );
}
```

Don't forget to import the `Link` component from `next/link`.

Also, let's update our interface to accept the `tableOfContents` array.

And make sure to pass tableOfContents to the `ArticleOverview` component.

## Adding Our New Blocks

Let's add the following blocks base on the blocks that we have created in our Strapi instance.

- Heading
- Paragraph With Image
- Paragraph
- Full Image

We will add the files in the `components/blocks` folder first, then update our types file to include the new blocks.

And finally pass them to the `BlockRenderer` component.

`Heading.tsx` code:

```tsx
import React from "react";
import type { HeadingProps } from "@/types";
export function Heading({ heading, linkId }: Readonly<HeadingProps>) {
  return (
    <h3 className="article-headline" id={linkId}>
      {heading}
    </h3>
  );
}
```

`Paragraph.tsx` code:

```tsx
import React from 'react'
import { ParagraphProps } from '@/types'
import ReactMarkdown from 'react-markdown'

export function Paragraph({ content }: Readonly<ParagraphProps>) {
  return (
    <div className="copy article-paragraph">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
```

`FullImage.tsx` code:

```tsx
import { FullImageProps } from "@/types";
import { StrapiImage } from "@/components/StrapiImage";

export function FullImage({ image }: Readonly<FullImageProps>) {
  return (
    <div className="article-image">
      <StrapiImage
        src={image.url}
        alt={image.alternativeText || "No alternative text provided"}
        width={1920}
        height={1080}
        className="article-image__image"
      />
    </div>
  );
}
```

`ParagraphWithImage.tsx` code:

```tsx
import ReactMarkdown from "react-markdown";
import { StrapiImage } from "../StrapiImage";
import { ParagraphWithImageProps } from "@/types";

export function ParagraphWithImage({
  content,
  image,
  reversed,
  imageLandscape,
}: Readonly<ParagraphWithImageProps>) {
  return (
    <div className={`article-text-image ${reversed ? "article-text-image--reversed" : ""} ${imageLandscape ? "" : "article-text-image--portrait"}`}>
      <ReactMarkdown className="copy article-text-image__text article-paragraph">
        {content}
      </ReactMarkdown>
      <div className="article-text-image__container">
        <StrapiImage
          src={image.url}
          alt={image.alternativeText || "No alternative text provided"}
          width={1920}
          height={1080}
          className="article-text-image__image"
        />
      </div>
    </div>
  );
}

```

Now that we have the blocks, we need to update our `BlockRenderer` component to render the new blocks.

But before we do that, let's update our `types.ts` file to include the new blocks.

`types.ts` code:

```tsx
type ComponentType =
  | "blocks.hero-section"
  | "blocks.info-block"
  | "blocks.featured-article"
  | "blocks.subscribe"
  | "blocks.heading"
  | "blocks.paragraph-with-image"
  | "blocks.paragraph"
  | "blocks.full-image";

interface Base<T extends ComponentType, D extends object = Record<string, unknown>> {
  id: number;
  __component?: T;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  data?: D;
}

export type Block =
  | HeroSectionProps
  | InfoBlockProps
  | FeaturedArticleProps
  | SubscribeProps
  | HeadingProps
  | ParagraphWithImageProps
  | ParagraphProps
  | FullImageProps;

export interface HeroSectionProps extends Base<"blocks.hero-section"> {
  theme: "turquoise" | "orange";
  heading: string;
  image: ImageProps;
  cta?: LinkProps;
  logo?: LogoProps;
  author?: string;
  darken?: boolean;
}

export interface InfoBlockProps extends Base<"blocks.info-block"> {
  theme: "turquoise" | "orange";
  reversed?: boolean;
  headline: string;
  content: string;
  image: ImageProps;
  cta?: LinkProps;
}

export interface FeaturedArticleProps extends Base<"blocks.featured-article"> {
  headline: string;
  excerpt: string;
  link: LinkProps;
  image: ImageProps;
}

export interface SubscribeProps extends Base<"blocks.subscribe"> {
  headline: string;
  content: string;
  placeholder: string;
  buttonText: string;
}

export interface HeadingProps extends Base<"blocks.heading"> {
  heading: string;
  linkId?: string;
}

export interface ParagraphWithImageProps extends Base<"blocks.paragraph-with-image"> {
  content: string;
  image: ImageProps;
  reversed?: boolean;
  imageLandscape?: boolean;
}

export interface ParagraphProps extends Base<"blocks.paragraph"> {
  content: string;
}

export interface FullImageProps extends Base<"blocks.full-image"> {
  id: number;
  __component: "blocks.full-image";
  image: ImageProps;
}
```

Now that we have the blocks, we can update our `BlockRenderer` component to render the new blocks.

`BlockRenderer.tsx` code:

```tsx
import type { Block } from "@/types";

import { HeroSection } from "@/components/blocks/HeroSection";
import { InfoBlock } from "@/components/blocks/InfoBlock";
import { FeaturedArticle } from "@/components/blocks/FeaturedArticle";
import { Subscribe } from "@/components/blocks/Subscribe";
import { Heading } from "@/components/blocks/Heading";
import { ParagraphWithImage } from "@/components/blocks/ParagraphWithImage";
import { Paragraph } from "@/components/blocks/Paragraph";
import { FullImage } from "@/components/blocks/FullImage";

function blockRenderer(block: Block, index: number) {
  switch (block.__component) {
    case "blocks.hero-section":
      return <HeroSection {...block} key={index} />;
    case "blocks.info-block":
      return <InfoBlock {...block} key={index} />;
    case "blocks.featured-article":
      return <FeaturedArticle {...block} key={index} />;
    case "blocks.subscribe":
      return <Subscribe {...block} key={index} />;
    case "blocks.heading":
      return <Heading {...block} key={index} />;
    case "blocks.paragraph-with-image":
      return <ParagraphWithImage {...block} key={index} />;
    case "blocks.paragraph":
      return <Paragraph {...block} key={index} />;
    case "blocks.full-image":
      return <FullImage {...block} key={index} />;
    default:
      return null;
  }
}

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return blocks.map((block, index) => blockRenderer(block, index));
}

```

Final Code: 

``` tsx
import type { ArticleProps, Block } from "@/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/utils/format-date";
import { getContentBySlug } from "@/data/loaders";

import { BlockRenderer } from "@/components/BlockRenderer";
import { HeroSection } from "@/components/blocks/HeroSection";
import { Card, type CardProps } from "@/components/Card";
import { ContentList } from "@/components/ContentList";

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

const BlogCard = (props: Readonly<CardProps>) => <Card {...props} basePath="blog" />;


export default async function SingleBlogRoute({ params }: PageProps) {
  const slug = (await params).slug;
  const { article, blocks } = await loader(slug);
  const { title, author, publishedAt, description, image } = article;

  console.dir(blocks, { depth: null });

  const tableOfContent = blocks?.filter(
    (block: Block) => block.__component === "blocks.heading"
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
          tableOfContent={tableOfContent}
        />
        <BlockRenderer blocks={blocks} />
        <ContentList
          headline="Featured Articles"
          path="/api/articles"
          component={BlogCard}
          featured={true}
        />
      </div>
    </div>
  );
}

```