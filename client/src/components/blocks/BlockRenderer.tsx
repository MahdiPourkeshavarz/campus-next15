import { InfoBlock } from "@/components/blocks/InfoBlock";
import { HeroSection } from "./HeroSection";
import { FeaturedArticle } from "./FeaturedArticle";
import { Subscribe } from "./Subscribe";
import { Block, ComponentType } from "@/types";

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
