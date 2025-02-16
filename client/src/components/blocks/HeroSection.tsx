import Link from "next/link";
import { StrapiImage } from "./StrapiImage";
import { HeroSectionProps } from "@/types/homePage";

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
      <div className={`hero__headline hero__headline--${theme}`}>
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
