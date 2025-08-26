"use client";
import { useRouter } from "next/navigation";

export function UrlSearch() {
  const router = useRouter();

  const search = (formData: FormData) => {
    // TODO: url 확인 필요
    const url = formData.get("url");
    const seo = formData.get("includesSeo");
    const sitemap = formData.get("includesSitemap");
    console.log({ url, seo, sitemap });
    router.push("/search?url=" + url);
  };
  return (
    <form action={search}>
      <input id="url" name="url" className=""/>
      <button type="submit">submit</button>
      <input
        id="includesSeo"
        name="includesSeo"
        type="checkbox"
        defaultChecked={true}
      />
      <label htmlFor="includesSeo">SEO 검사 포함</label>
      <input id="includesSitemap" name="includesSitemap" type="checkbox" />
      <label htmlFor="includesSitemap">
        sitemap에 따른 하위 사이트 가져오기
      </label>
    </form>
  );
}
