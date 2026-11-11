import { posts } from "@/content/blog";
import type { BlogPost } from "@/content/blog/types";

// issue #76 — site blog registry helpers.
export function getPosts(lang: Language): BlogPost[] {
  return posts
    .filter((p) => p.lang === lang)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPost(lang: Language, slug: string): BlogPost | undefined {
  return posts.find((p) => p.lang === lang && p.slug === slug);
}

export function getPostLanguages(slug: string): Language[] {
  return posts.filter((p) => p.slug === slug).map((p) => p.lang);
}

/** Visible body text length (summary + sections + FAQ), for the quality gate. */
export function postTextLength(post: BlogPost): number {
  const parts: string[] = [...post.summary];
  for (const s of post.sections) {
    parts.push(s.heading);
    for (const b of s.blocks) {
      if (b.type === "list") parts.push(...b.items);
      else if (b.type === "table") parts.push(...b.head, ...b.rows.flat());
      else if (b.type === "callout") parts.push(b.text);
      else parts.push(b.text);
    }
  }
  for (const f of post.faq) parts.push(f.q, f.a);
  return parts.join("").length;
}
