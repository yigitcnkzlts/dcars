import type { MetadataRoute } from "next";
import { blogArticles } from "@/lib/blogArticles";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://dcars.tr";
  const routes = ["", "/arac-degerleme", "/arac-karsilastirma", "/blog", "/sss", "/hakkimizda", "/nasil-calisir", "/iletisim", "/aydinlatma-metni", "/gizlilik-sozlesmesi", "/cerez-politikasi", "/sartlar-ve-kosullar"];
  return [...routes.map((route) => ({ url: `${base}${route}`, changeFrequency: route === "" ? "weekly" as const : "monthly" as const, priority: route === "" ? 1 : .7 })), ...blogArticles.map((article) => ({ url: `${base}/blog/${article.slug}`, changeFrequency: "monthly" as const, priority: .75 }))];
}
