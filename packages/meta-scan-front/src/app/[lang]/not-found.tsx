import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/dictionaries";
import { getSiteSetting } from "@/utils/siteSetting";

export default async function NotFound() {
  const { lang } = await getSiteSetting();
  const t = (await getDictionary(lang)).notFound;

  return (
    <div className="flex items-center justify-center py-24">
      <div className="mx-auto max-w-md px-4 text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-border bg-muted">
          <Compass className="h-11 w-11 text-muted-foreground" />
        </div>

        <div className="mb-2 font-mono text-sm text-muted-foreground">404</div>
        <h2 className="mb-3 text-3xl font-semibold text-foreground">
          {t.title}
        </h2>
        <p className="mb-10 text-muted-foreground">{t.description}</p>

        <Button asChild size="lg" className="rounded-xl px-8">
          <Link href={`/${lang}`}>{t.action}</Link>
        </Button>
      </div>
    </div>
  );
}
