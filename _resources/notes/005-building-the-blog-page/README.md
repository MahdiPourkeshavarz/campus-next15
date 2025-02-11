# Building The Blog Page in Next.js

Populate query:

```ts
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

```

Featured Article Code:

``` tsx
import type { FeaturedArticleProps } from "@/types";
import Link from "next/link";
import { StrapiImage } from "@/components/StrapiImage";
import ReactMarkdown from "react-markdown";

export function FeaturedArticle({
  headline,
  link,
  excerpt,
  image,
}: Readonly<FeaturedArticleProps>) {
  return (
    <article className="featured-article container">
      <div className="featured-article__info">
        <h3>{headline}</h3>
        <ReactMarkdown className="copy">{excerpt}</ReactMarkdown>
        <Link
          href={link.href}
          className="btn btn--turquoise btn--medium"
        >
          {link.text}
        </Link>
      </div>
      <StrapiImage
        src={image.url}
        alt={image.alternativeText || "No alternative text provided"}
        height={200}
        width={300}
      />
    </article>
  );
}

```

Types:

``` ts
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
```

## Adding the Subscribe block

Subscribe Component:

``` tsx
"use client";
import type { SubscribeProps } from "@/types";

export function Subscribe({
  headline,
  content,
  placeholder,
  buttonText,
}: Readonly<SubscribeProps>) {
  return (
    <section className="newsletter container">
      <div className="newsletter__info">
        <h4>{headline}</h4>
        <p className="copy">{content}</p>
      </div>
      <form className="newsletter__form">
        <input
          name="email"
          type="email"
          placeholder={placeholder}
          className={`newsletter__email`}
        />
        <button
          type="submit"
          className="newsletter__subscribe btn btn--turquoise btn--medium"
        >
          {buttonText}
        </button>
      </form>
    </section>
  );
}

```
