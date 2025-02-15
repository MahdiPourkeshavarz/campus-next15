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
  blocks: Block[];
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

type ComponentType = "blocks.hero-section" | "blocks.info-block";

export interface homePageDataResponse<
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

export interface HeroSectionProps
  extends homePageDataResponse<"blocks.hero-section"> {
  theme: "turquoise" | "orange";
  heading: string;
  image: ImageProps;
  cta?: LinkProps;
  logo?: LogoProps;
  author?: string;
  darken?: boolean;
}

export interface InfoBlockProps
  extends homePageDataResponse<"blocks.info-block"> {
  theme: "turquoise" | "orange";
  reversed?: boolean;
  headline: string;
  content: string;
  image: ImageProps;
  cta?: LinkProps;
}

export interface StrapiImageProps {
  src: string;
  alt: string;
  className?: string;
  [key: string]: string | number | boolean | undefined;
}
