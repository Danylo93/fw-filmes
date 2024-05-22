import { DefaultSeoProps } from "next-seo";

const siteName = "fw-filmes";
const title = "FW Filmes";
const description = "FW Filmes, explore & discover movies and TV shows.";
const keywords = [
  "fw-filmes",
  "movies",
  "tv",
  "explore movies",
  "discover tv shows",
];

const seoConfig: DefaultSeoProps = {
  defaultTitle: title,
  titleTemplate: `%s – FW Filmes`,
  description: description,
  openGraph: {
    title: title,
    description: description,
    type: "website",
    site_name: siteName,
  },
  additionalMetaTags: [{ name: "keywords", content: keywords.join(",") }],
};

export default seoConfig;
