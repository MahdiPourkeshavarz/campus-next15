import QueryString from "qs";

export const BASE_URL: string = "http://localhost:1337";

export const HOME_URL: string = "/api/home-page";

export const HOME_PAGE_QUERY =
  "?populate[blocks][on][blocks.hero-section][populate][image][fields][0]=url&populate[blocks][on][blocks.hero-section][populate][image][fields][1]=alternativeText&populate[blocks][on][blocks.hero-section][populate][logo][populate][image][fields][0]=url&populate[blocks][on][blocks.hero-section][populate][logo][populate][image][fields][1]=alternativeText&populate[blocks][on][blocks.hero-section][populate][cta]=true&populate[blocks][on][blocks.info-block][populate][image][fields][0]=url&populate[blocks][on][blocks.info-block][populate][image][fields][1]=alternativeText&populate[blocks][on][blocks.info-block][populate][cta]=true";

export const pageBySlugQuery = (slug: string) =>
  QueryString.stringify({
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
  });
