# Building The Experience Page in Next.js
Starter snippet:

``` tsx
interface PageProps {
  params: Promise<{ slug: string }>
}


export default async function DynamicPageRoute({ params }: PageProps) {
  const slug = (await params).slug;

  return (
    <div>
      <h1>Slug: {slug}</h1>
    </div>
  );
}
```


Page structure code:

```tsx
import { getPageBySlug } from "@/data/loaders";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/BlockRenderer";

async function loader(slug: string) {
  const { data } = await getPageBySlug(slug);
  if (data.length === 0) notFound();
  return { blocks: data[0]?.blocks };
}

interface PageProps {
  params: Promise<{ slug: string }>
}


export default async function DynamicPageRoute({ params }: PageProps) {
  const slug = (await params).slug;
  const { blocks } = await loader(slug);
  return <BlockRenderer blocks={blocks} />;
}
```

## 2.1. Fetching Data From Strapi

Query for fetching data from Strapi:
```ts
const pageBySlugQuery = (slug: string) => qs.stringify(
  {
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: {
      blocks: {
        on: {
          "blocks.hero-section": {
            populate: {
              image: {
                fields: ["url", "alternativeText"],
              },
              logo: {
                populate: {
                  image: {
                    fields: ["url", "alternativeText"],
                  },
                },
              },
              cta: true,
            },
          },
          "blocks.info-block": {
            populate: {
              image: {
                fields: ["url", "alternativeText"],
              },
              cta: true,
            },
          },
        },
      },
    },
  },
);

```
Function for fetching data from Strapi:

```ts
export async function getPageBySlug(slug: string) {
  const path = "/api/pages";
  const url = new URL(path, BASE_URL);
  url.search = pageBySlugQuery(slug);
  return await fetchAPI(url.href, { method: "GET" });
}
```
