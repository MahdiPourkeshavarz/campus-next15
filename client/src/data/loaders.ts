import {
  BASE_URL,
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

export async function getContent(path: string) {
  const url = new URL(path, BASE_URL);

  url.search = QueryString.stringify({
    sort: ["createdAt:desc"],
    populate: {
      image: {
        fields: ["url", "alternativeText"],
      },
    },
  });

  return fetchAPI(url.href, { method: "GET" });
}
