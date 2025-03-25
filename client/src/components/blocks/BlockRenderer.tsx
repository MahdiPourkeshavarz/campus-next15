import { InfoBlock } from "@/components/blocks/InfoBlock";
import { HeroSection } from "./HeroSection";
import { FeaturedArticle } from "./FeaturedArticle";
import { Subscribe } from "./Subscribe";
import { Block, ComponentType } from "@/types";
import { Heading } from "./Heading";
import { FullImage } from "./FullImage";
import { Paragraph } from "./Paragraph";
import { ParagraphWithImage } from "./ParagraphWithImage";

function blockRenderer(block: Block<ComponentType>, index: number) {
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
    case "blocks.full-image":
      return <FullImage {...block} key={index} />;
    case "blocks.paragraph":
      return <Paragraph {...block} key={index} />;
    case "blocks.paragraph-with-image":
      return <ParagraphWithImage {...block} key={index} />;
    default:
      return null;
  }
}

export function BlockRenderer({
  blocks,
}: {
  blocks: Array<Block<ComponentType>>;
}) {
  return blocks.map((block, index) => blockRenderer(block, index));
}
