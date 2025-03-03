import {
  BASE_URL,
  BLOG_PAGE_SIZE,
  globalSettingQuery,
  HOME_PAGE_QUERY,
  HOME_URL,
  pageBySlugQuery,
} from "@/constants";
import { fetchAPI } from "@/utils/homePageData";
import QueryString from "qs";

export async function getHomePageData() {
  const url = new URL(HOME_URL, BASE_URL);
  url.search = HOME_PAGE_QUERY;
  try {
    const response = await fetchAPI(url.href, {
      method: "GET",
    });
    if (response) return response;
  } catch {
    throw new Error("something terrible happened!");
  }
}

export async function getPageBySlug(slug: string) {
  const path = "/api/pages";
  const url = new URL(path, BASE_URL);
  url.search = pageBySlugQuery(slug);
  return await fetchAPI(url.href, { method: "GET" });
}

export async function getGlobalSettings() {
  const path = "/api/global";
  const url = new URL(path, BASE_URL);
  url.search = globalSettingQuery;
  return fetchAPI(url.href, { method: "GET" });
}

export async function getContent(
  path: string,
  featured?: boolean,
  query?: string,
  page?: string
) {
  const url = new URL(path, BASE_URL);

  url.search = QueryString.stringify({
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
