import { FullImageProps } from "@/types";
import { StrapiImage } from "./StrapiImage";

export function FullImage({ image }: Readonly<FullImageProps>) {
  return (
    <div className="article-image">
      <StrapiImage
        src={image.url}
        alt={image.alternativeText || "No alternative text provided"}
        width={1920}
        height={1080}
        className="article-image__image"
      />
    </div>
  );
}
