## Implementing Search in Next.js

These examples are base on [this next.js documentation](https://nextjs.org/learn/dashboard-app/adding-search-and-pagination).

Search Component:

```tsx
"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function Search() {
  // Get access to URL search parameters, routing, and current pathname
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  // Create a debounced search handler that only triggers 300ms after the user stops typing
  const handleSearch = useDebouncedCallback((term: string) => {
    // Create a new URLSearchParams instance with current params
    const params = new URLSearchParams(searchParams);
    // Reset to first page whenever search term changes
    params.set("page", "1");

    // Update URL search parameters based on search term
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    // Update the URL without triggering a page refresh
    // scroll: false prevents the page from jumping to top
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);

  return (
    <div className="search">
      <input
        type="text"
        placeholder="Search"
        // Call handleSearch whenever input value changes
        onChange={(e) => handleSearch(e.target.value)}
        // Initialize input with existing search query from URL
        defaultValue={searchParams.get("query")?.toString()}
      />
    </div>
  );
}
```

Pagination Component:

```tsx
"use client";
import { FC } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

// Props interface for the main pagination component
interface PaginationProps {
  pageCount: number; // Total number of pages
}

// Props interface for the arrow buttons
interface PaginationArrowProps {
  direction: "left" | "right"; // Direction of the arrow
  href: string; // URL to navigate to
  isDisabled: boolean; // Whether the arrow should be disabled
}

// Arrow button component for navigation
const PaginationArrow: FC<PaginationArrowProps> = ({
  direction,
  href,
  isDisabled,
}) => {
  const router = useRouter();
  const isLeft = direction === "left";

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        // Use Next.js client-side navigation without scroll reset
        router.push(href, { scroll: false });
      }}
      className={`pagination-arrow ${isDisabled ? "disabled" : ""}`}
      aria-disabled={isDisabled}
      disabled={isDisabled}
    >
      {isLeft ? "«" : "»"}
    </button>
  );
};

export function PaginationComponent({ pageCount }: Readonly<PaginationProps>) {
  // Get current URL path and search parameters using Next.js hooks
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Extract current page from URL params, defaulting to 1 if not present
  const currentPage = Number(searchParams.get("page")) || 1;

  // Helper function to create URLs for pagination
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`; // Combines current path with updated page parameter
  };

  return (
    <nav role="navigation" aria-label="Pagination" className="pagination-nav">
      <ul className="pagination-list">
        {/* Left arrow - disabled if on first page */}
        <li>
          <PaginationArrow
            direction="left"
            href={createPageURL(currentPage - 1)}
            isDisabled={currentPage <= 1}
          />
        </li>
        {/* Current page indicator */}
        <li>
          <span className="page-number">Page {currentPage}</span>
        </li>
        {/* Right arrow - disabled if on last page */}
        <li>
          <PaginationArrow
            direction="right"
            href={createPageURL(currentPage + 1)}
            isDisabled={currentPage >= pageCount}
          />
        </li>
      </ul>
    </nav>
  );
}
```

## Adding Our Components

ContentList Update Final:

```tsx
import { ArticleProps } from "@/types";
import { getContent } from "@/data/loaders";

import { PaginationComponent } from "./PaginationComponent";
import { Search } from "@/components/Search"

interface ContentListProps {
  headline: string;
  query?: string;
  path: string;
  featured?: boolean;
  component: React.ComponentType<ArticleProps & { basePath: string }>;
  headlineAlignment?: "center" | "right" | "left";
  showSearch?: boolean;
  page?: string;
  showPagination?: boolean;
}

async function loader(path: string, featured?: boolean, query?: string, page?:string ) {
  const { data, meta } = await getContent(path, featured, query, page);
  return {
    articles: (data as ArticleProps[]) || [],
    pageCount: meta?.pagination?.pageCount || 1,
  };
}

export async function ContentList({
  headline,
  path,
  featured,
  component,
  headlineAlignment,
  showSearch,
  query,
  page,
  showPagination,
}: Readonly<ContentListProps>) {
  const { articles, pageCount } = await loader(path, featured, query, page);
  const Component = component;
  return (
    <section className="content-items container">
      <h3 className={`content-items__headline ${headlineAlignment ?? ""}`}>
        {headline || "Featured Articles"}
      </h3>
      {showSearch && <Search />}
      <div className="content-items__container--card">
        {articles.map((article) => (
          <Component key={article.documentId} {...article} basePath={path} />
        ))}
      </div>
      {showPagination && <PaginationComponent pageCount={pageCount} />}
    </section>
  );
}
```

Update the loader:

```tsx
export async function getContent(
  path: string,
  featured?: boolean,
  query?: string,
  page?: string
) {
  const url = new URL(path, BASE_URL);

  url.search = qs.stringify({
    sort: ["createdAt:desc"],
    filters: {
      $or: [
        { title: { $containsi: query } },
        { description: { $containsi: query } },
      ],
      ...(featured && { featured: { $eq: featured } }),
    },
    pagination: {
      pageSize: BLOG_PAGE_SIZE,
      page: parseInt(page || "1"),
    },
    populate: {
      image: {
        fields: ["url", "alternativeText"],
      },
    },
  });

  return fetchAPI(url.href, { method: "GET" });
}
```

Blog Page Update:

```tsx
import { getPageBySlug } from "@/data/loaders";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/BlockRenderer";
import { ContentList } from "@/components/ContentList";
import { BlogCard } from "@/components/BlogCard";

async function loader(slug: string) {
  const { data } = await getPageBySlug(slug);
  if (data.length === 0) notFound();
  return { blocks: data[0]?.blocks };
}

interface PageProps {
  searchParams: Promise<{ page?: string; query?: string }>;
}

export default async function BlogRoute({ searchParams }: PageProps) {
  const { page, query } = await searchParams;
  const { blocks } = await loader("blog");

  return (
    <div className="blog-page">
      <BlockRenderer blocks={blocks} />
      <ContentList
        headline="Check out our latest articles"
        path="/api/articles"
        component={BlogCard}
        query={query}
        page={page}
        showSearch
        showPagination
      />
    </div>
  );
}
```

Landing Page Update Featured Posts:

```tsx
import { BlockRenderer } from "@/components/BlockRenderer";
import { ContentList } from "@/components/ContentList";
import { BlogCard } from "@/components/BlogCard";
import { getHomePage } from "@/data/loaders";
import { notFound } from "next/navigation";

async function loader() {
  const data = await getHomePage();
  if (!data) notFound();
  return { ...data.data };
}

export default async function HomeRoute() {
  const data = await loader();
  const blocks = data?.blocks || [];
  return (
    <div>
      <BlockRenderer blocks={blocks} />
      <div className="container">
        <ContentList
          headline="Featured Articles"
          path="/api/articles"
          component={BlogCard}
          featured
        />
      </div>
    </div>
  );
}
```
