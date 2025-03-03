import { Card, CardProps } from "./Card";

export const BlogCard = (props: Readonly<CardProps>) => (
  <Card {...props} basePath="blog" />
);
