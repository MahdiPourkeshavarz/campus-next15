import { HeroSection } from "@/components/blocks/heroSection";
import { getHomePageData } from "@/data/loaders";
import { notFound } from "next/navigation";

export default async function Home() {
  const data = await getHomePageData();
  if (!data) notFound();

  const blocks = data?.blocks || [];

  return (
    <>
      <div>
        <p></p>
        <HeroSection {...blocks[0]} />
      </div>
    </>
  );
}
