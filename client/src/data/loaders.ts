import { BASE_URL, HOME_PAGE_QUERY, HOME_URL } from "@/constants";
import { homePageDataResponse } from "@/types/homePage";
import { fetchAPI } from "@/utils/homePageData";

export async function getHomePageData() {
  const url = new URL(HOME_URL, BASE_URL);
  url.search = HOME_PAGE_QUERY;
  try {
    const response: homePageDataResponse = await fetchAPI(url.href, {
      method: "GET",
    });
    if (response) return response;
  } catch {
    throw new Error("something terrible happened!");
  }
}
