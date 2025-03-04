import { FeaturedArticleProps } from "@/types";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { StrapiImage } from "./StrapiImage";

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
        <Link href={link.href} className="btn btn--turquoise btn--medium">
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
