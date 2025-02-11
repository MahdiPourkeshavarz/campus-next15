# Building The Landing Page In Next.js

Now that we have created our _Home Page_ in Strapi with few blocks, let's first take a look how we can retrieve our data.

## 1.1. Fetching Data From Strapi

Home Page populate query:

```ts
{
  populate: {
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
      },
    },
  },
};
```

LHS Query Syntax:

```
/api/home-page?populate[blocks][on][blocks.hero-section][populate][image][fields][0]=url&populate[blocks][on][blocks.hero-section][populate][image][fields][1]=alternativeText&populate[blocks][on][blocks.hero-section][populate][logo][populate][image][fields][0]=url&populate[blocks][on][blocks.hero-section][populate][logo][populate][image][fields][1]=alternativeText&populate[blocks][on][blocks.hero-section][populate][cta]=true&populate[blocks][on][blocks.info-block][populate][image][fields][0]=url&populate[blocks][on][blocks.info-block][populate][image][fields][1]=alternativeText&populate[blocks][on][blocks.info-block][populate][cta]=true
```

## 1.2. Fetching Data From Strapi With Next.js

Let's start by creating a new file in our `src/utils` folder called `fetch-api.ts`.

And add the following code to it:

```ts
type NextFetchRequestConfig = {
  revalidate?: number | false;
  tags?: string[];
};

interface FetchAPIOptions {
  method: "GET" | "POST" | "PUT" | "DELETE";
  authToken?: string;
  body?: Record<string, unknown>;
  next?: NextFetchRequestConfig;
}

export async function fetchAPI(url: string, options: FetchAPIOptions) {
  const { method, authToken, body, next } = options;

  const headers: RequestInit & { next?: NextFetchRequestConfig } = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
    ...(next && { next }),
  };

  try {
    const response = await fetch(url, headers);
    const contentType = response.headers.get("content-type");
    if (
      contentType &&
      contentType.includes("application/json") &&
      response.ok
    ) {
      return await response.json();
    } else {
      return { status: response.status, statusText: response.statusText };
    }
  } catch (error) {
    console.error(`Error ${method} data:`, error);
    throw error;
  }
}
```

The above function provides a standardized way to make HTTP requests to a Strapi backend API.

Here's what it does:

1. It accepts a URL and options (including HTTP method, auth token, request body, and Next.js-specific configurations)
   Sets up proper headers including content-type and optional authentication
   Makes the actual fetch request
   Handles the response:
   If it's JSON and successful, returns the parsed JSON data
   If not, returns the status and status text
   If there's an error, logs it and throws it

It's essentially a wrapper around the native fetch API that adds error handling, authentication, and TypeScript type safety, specifically designed to work with Strapi and Next.js.

This will simplify our code and make it more readable and maintainable.

Now let's create a new file in our `src/data` folder called `loaders.ts` and add the following code to it:

```ts
import { getStrapiURL } from "@/utils/get-strapi-url";
import { fetchAPI } from "@/utils/fetch-api";

const BLOG_PAGE_SIZE = 3;
const BASE_URL = getStrapiURL();

export async function getHomePage() {
  const path = "/api/home-page";
  const url = new URL(path, BASE_URL);
  return fetchAPI(url.href, { method: "GET" });
}
```

Notice that we are using the `getStrapiURL` function to get the base URL of our Strapi instance. Let's add this function to our `src/utils` folder in a new file called `get-strapi-url.ts`.

```ts
export function getStrapiURL() {
  return process.env.STRAPI_API_URL ?? "http://localhost:1337";
}
```

Now let's navigate to our `src/app/page.tsx` file refactor our code with the `fetchAPI` function.

```ts
import { getHomePage } from "@/data/loaders";
import { notFound } from "next/navigation";

async function loader() {
  const data = await getHomePage();
  if (!data) notFound();
  console.log(data);
  return { ...data.data };
}

export default async function HomeRoute() {
  const data = await loader();
  console.log(data);
  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
    </div>
  );
}
```

Now let's run our application and see if it works.

## Component Types

`types.ts` file:

```ts
export interface LinkProps {
  id: number;
  text: string;
  href: string;
  isExternal: boolean;
}

export interface ImageProps {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string;
}

export interface LogoProps {
  logoText: string;
  image: ImageProps;
}

type ComponentType = "blocks.hero-section" | "blocks.info-block";

interface Base<
  T extends ComponentType,
  D extends object = Record<string, unknown>
> {
  id: number;
  __component?: T;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  data?: D;
}

export type Block = HeroSectionProps | InfoBlockProps;

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
```

## 1.3. Adding The Hero Section

```tsx
import Link from "next/link";
import { StrapiImage } from "../StrapiImage";
import type { HeroSectionProps } from "@/types";

export function HeroSection({
  theme,
  heading,
  cta,
  image,
  logo,
  author,
  publishedAt,
  darken = false,
}: Readonly<HeroSectionProps>) {
  return (
    <section className="hero">
      <div className="hero__background">
        <StrapiImage
          src={image.url}
          alt={image.alternativeText || "No alternative text provided"}
          className="hero__background-image"
          width={1920}
          height={1080}
        />
        {darken && <div className="hero__background__overlay"></div>}
      </div>
      <div className={`hero__heading hero__heading--${theme}`}>
        <h1>{heading}</h1>
        {author && <p className="hero__author">{author}</p>}
        {publishedAt && <p className="hero__published-at">{publishedAt}</p>}
      </div>
      {cta && (
        <button className={`btn btn--medium btn--${theme}`}>
          <Link href={cta.href} target={cta.isExternal ? "_blank" : "_self"}>
            {cta.text}
          </Link>
        </button>
      )}
      {logo && (
        <StrapiImage
          src={logo.image.url}
          alt={logo.image.alternativeText || "No alternative text provided"}
          className={`hero__logo hero__logo--${theme}`}
          width={120}
          height={120}
        />
      )}
    </section>
  );
}
```

## 1.3.1. Adding The StrapiImage Component

```tsx
import Image from "next/image";
import { getStrapiURL } from "@/utils/get-strapi-url";

interface StrapiImageProps {
  src: string;
  alt: string;
  className?: string;
  [key: string]: string | number | boolean | undefined;
}

export function StrapiImage({
  src,
  alt,
  className,
  ...rest
}: Readonly<StrapiImageProps>) {
  const imageUrl = getStrapiMedia(src);
  if (!imageUrl) return null;

  return <Image src={imageUrl} alt={alt} className={className} {...rest} />;
}

export function getStrapiMedia(url: string | null) {
  if (url == null) return null;
  if (url.startsWith("data:")) return url;
  if (url.startsWith("http") || url.startsWith("//")) return url;
  return getStrapiURL() + url;
}
```

## 1.4. Adding The Info Block

```tsx
import { StrapiImage } from "../StrapiImage";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

import type { InfoBlockProps } from "@/types";

export function InfoBlock({
  theme,
  reversed,
  image,
  headline,
  content,
  cta,
}: Readonly<InfoBlockProps>) {
  return (
    <section className={`info info--${theme} ${reversed && "info--reversed"}`}>
      <StrapiImage
        src={image.url}
        alt={image.alternativeText || "No alternative text provided"}
        height={500}
        width={600}
        className="info__image"
      />
      <div className="info__text">
        <h2 className={`info__headline info__headline--${theme}`}>
          {headline}
        </h2>
        <ReactMarkdown className="copy">{content}</ReactMarkdown>
        {cta && (
          <Link href={cta.href} target={cta.isExternal ? "_blank" : "_self"}>
            <button className={`btn btn--medium btn--${theme}`}>
              {cta.text}
            </button>
          </Link>
        )}
      </div>
    </section>
  );
}
```

## 1.5. Building The Block Renderer

```tsx
import type { Block } from "@/types";

import { HeroSection } from "@/components/blocks/HeroSection";
import { InfoBlock } from "@/components/blocks/InfoBlock";

function blockRenderer(block: Block, index: number) {
  switch (block.__component) {
    case "blocks.hero-section":
      return <HeroSection {...block} key={index} />;
    case "blocks.info-block":
      return <InfoBlock {...block} key={index} />;
    default:
      return null;
  }
}

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return blocks.map((block, index) => blockRenderer(block, index));
}
```

## Putting It All Together

``` tsx
import { BlockRenderer } from "@/components/BlockRenderer";

import { getHomePage } from "@/data/loaders";
import { notFound } from "next/navigation";

async function loader() {
  const data = await getHomePage();
  if (!data) notFound();
  console.log(data);
  return { ...data.data };
}

export default async function HomeRoute() {
  const data = await loader();
  const blocks = data?.blocks || [];
  console.log(data);
  return <BlockRenderer blocks={blocks} />;
}

```

