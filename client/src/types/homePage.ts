export interface Root {
  data: Data;
  meta: Meta;
}

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

export interface Block {
  __component: string;
  id: number;
  heading?: string;
  theme: string;
  image: Image;
  logo?: Logo;
  cta: any;
  reversed?: boolean;
  headline?: string;
  content?: string;
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
