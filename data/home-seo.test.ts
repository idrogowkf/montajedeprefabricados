import { describe, expect, it } from "vitest";
import { homeFaqs, homeRelatedLinks } from "./home-seo";

describe("home SEO content", () => {
  it("supports a visible FAQ and crawlable topic clusters", () => {
    expect(homeFaqs.length).toBeGreaterThanOrEqual(4);
    expect(homeRelatedLinks.services.length).toBeGreaterThanOrEqual(5);
    expect(homeRelatedLinks.types.length).toBeGreaterThanOrEqual(5);
    expect(homeRelatedLinks.locations.length).toBe(10);
    const paths = Object.values(homeRelatedLinks).flat().map((item) => item.href);
    expect(new Set(paths).size).toBe(paths.length);
  });
});
