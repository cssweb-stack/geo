export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "geo.css": "geo.css" });
  eleventyConfig.addPassthroughCopy({ "_media": "_media" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addWatchTarget("geo.css");
  return {
    pathPrefix: process.env.SITE_PATH_PREFIX || "/",
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    htmlTemplateEngine: "njk", markdownTemplateEngine: "njk",
    templateFormats: ["html", "njk", "md"]
  };
}
