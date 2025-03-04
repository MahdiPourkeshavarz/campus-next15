/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */

export interface Data {
  id: number;
  documentId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  blocks: Array<Block<ComponentType>>;
}

export interface Image {
  id: number;
  documentId: string;
  url: string;
  alternativeText: any;
}

export interface Logo {
  id: number;
  logoText: string;
  image: Image2;
}

export interface Image2 {
  id: number;
  documentId: string;
  url: string;
  alternativeText: any;
}

export interface Meta {}

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

export interface StrapiImageProps {
  src: string;
  alt: string;
  className?: string;
  [key: string]: string | number | boolean | undefined;
}

export type ComponentType =
  | "blocks.hero-section"
  | "blocks.info-block"
  | "blocks.featured-article"
  | "blocks.subscribe";

// Define a base interface for all blocks
interface BaseBlock<T extends ComponentType> {
  id: number;
  __component?: T;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

// Define the props for each block type without circular references
export interface FeaturedArticleProps
  extends BaseBlock<"blocks.featured-article"> {
  headline: string;
  excerpt: string;
  link: LinkProps;
  image: ImageProps;
}

export interface SubscribeProps extends BaseBlock<"blocks.subscribe"> {
  headline: string;
  content: string;
  placeholder: string;
  buttonText: string;
}

export interface HeroSectionProps extends BaseBlock<"blocks.hero-section"> {
  theme: "turquoise" | "orange";
  heading: string;
  image: ImageProps;
  cta?: LinkProps;
  logo?: LogoProps;
  author?: string;
  darken?: boolean;
}

export interface InfoBlockProps extends BaseBlock<"blocks.info-block"> {
  theme: "turquoise" | "orange";
  reversed?: boolean;
  headline: string;
  content: string;
  image: ImageProps;
  cta?: LinkProps;
}

export type Block<T extends ComponentType> = T extends "blocks.hero-section"
  ? HeroSectionProps
  : T extends "blocks.info-block"
  ? InfoBlockProps
  : T extends "blocks.featured-article"
  ? FeaturedArticleProps
  : T extends "blocks.subscribe"
  ? SubscribeProps
  : never;

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
