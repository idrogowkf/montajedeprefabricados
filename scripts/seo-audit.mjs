const origin = process.env.SEO_AUDIT_ORIGIN || "http://localhost:3011";
const productionOrigin = "https://www.montajedeprefabricados.com";
const failures = [];
const values = { titles: new Map(), descriptions: new Map() };
const internalLinks = new Set();

const get = async (path, options) => fetch(`${origin}${path}`, { redirect: "manual", ...options });
const pick = (html, pattern) => html.match(pattern)?.[1]?.trim();
const count = (html, pattern) => [...html.matchAll(pattern)].length;

const sitemapResponse = await get("/sitemap.xml");
if (sitemapResponse.status !== 200) failures.push(`sitemap: HTTP ${sitemapResponse.status}`);
const sitemap = await sitemapResponse.text();
const paths = [...sitemap.matchAll(/<loc>https:\/\/www\.montajedeprefabricados\.com([^<]*)<\/loc>/g)].map(match => match[1] || "/");

for (const path of paths) {
  const response = await get(path);
  if (response.status !== 200) { failures.push(`${path}: HTTP ${response.status}`); continue; }
  const html = await response.text();
  const title = pick(html, /<title>([^<]+)<\/title>/i);
  const description = pick(html, /<meta name="description" content="([^"]+)"/i);
  const canonical = pick(html, /<link rel="canonical" href="([^"]+)"/i);
  const ogTitle = pick(html, /<meta property="og:title" content="([^"]+)"/i);
  const ogUrl = pick(html, /<meta property="og:url" content="([^"]+)"/i);
  const twitterCard = pick(html, /<meta name="twitter:card" content="([^"]+)"/i);
  const h1Count = count(html, /<h1(?:\s|>)/gi);
  const pageLinks = [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/gi)]
    .map(match => match[1])
    .filter(href => href.startsWith("/") && !href.startsWith("//"));
  for (const href of pageLinks) internalLinks.add(href.split("#")[0] || "/");
  const schemaTypes = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].flatMap(match => {
    try { const value = JSON.parse(match[1]); return Array.isArray(value) ? value.map(item => item["@type"]) : [value["@type"]]; }
    catch { failures.push(`${path}: JSON-LD inválido`); return []; }
  });
  for (const [label, value] of [["title", title], ["description", description], ["canonical", canonical], ["og:title", ogTitle], ["og:url", ogUrl], ["twitter:card", twitterCard]]) if (!value) failures.push(`${path}: falta ${label}`);
  const expectedCanonical = `${productionOrigin}${path === "/" ? "" : path}`;
  if (canonical !== expectedCanonical) failures.push(`${path}: canonical ${canonical} != ${expectedCanonical}`);
  if (ogUrl !== expectedCanonical) failures.push(`${path}: og:url ${ogUrl} != ${expectedCanonical}`);
  if (h1Count !== 1) failures.push(`${path}: ${h1Count} H1`);
  for (const type of path === "/presupuesto" ? ["WebPage"] : path === "/" ? ["WebPage", "Service", "FAQPage"] : ["WebPage", "BreadcrumbList", "Service", "FAQPage"]) if (!schemaTypes.includes(type)) failures.push(`${path}: falta schema ${type}`);
  for (const [key, value] of [["titles", title], ["descriptions", description]]) {
    if (value && values[key].has(value)) failures.push(`${path}: ${key} duplicado con ${values[key].get(value)}`);
    else if (value) values[key].set(value, path);
  }
}

for (const path of [...internalLinks].sort()) {
  const response = await get(path);
  if (response.status === 200) continue;
  if ([301, 302, 307, 308].includes(response.status) && response.headers.get("location")) continue;
  failures.push(`enlace interno roto ${path}: HTTP ${response.status}`);
}

const legacy = await get("/servicios/montaje-prefabricado-hormigon");
if (legacy.status !== 308 || legacy.headers.get("location") !== "/servicios/montaje-prefabricados") failures.push(`redirección legacy: HTTP ${legacy.status}, location ${legacy.headers.get("location")}`);
const robots = await (await get("/robots.txt")).text();
for (const directive of ["User-Agent: *", "Allow: /", `Host: ${productionOrigin}`, `Sitemap: ${productionOrigin}/sitemap.xml`]) if (!robots.includes(directive)) failures.push(`robots: falta ${directive}`);

console.log(JSON.stringify({ origin, sitemapUrls: paths.length, internalLinks: internalLinks.size, uniqueTitles: values.titles.size, uniqueDescriptions: values.descriptions.size, failures }, null, 2));
if (failures.length) process.exit(1);
