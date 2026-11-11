import { siteUrl } from "@/constans";
import { getPosts } from "@/services/blogPosts";
import { buildLlmsTxt } from "@/services/buildLlmsTxt";

// issue #76 — real /llms.txt (previously fell through to the home page).
export const dynamic = "force-static";

export function GET() {
  const posts = [...getPosts("ko"), ...getPosts("en")];
  return new Response(buildLlmsTxt({ siteUrl, posts }), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
