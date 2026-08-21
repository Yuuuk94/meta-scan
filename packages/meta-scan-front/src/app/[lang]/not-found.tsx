import Link from "next/link";
import { Button } from "@/ui/atoms/Button";
import { getDictionary } from "@/dictionaries";
import { getSiteSetting } from "@/utils/siteSetting";

export default async function NotFound() {
  const { lang } = await getSiteSetting();
  const t = (await getDictionary(lang)).notFound;

  return (
    <div className="content-frame flex flex-col items-center justify-center gap-4 py-16 text-center sm:py-28">
      <span className="font-display text-[4.75rem] font-black leading-none text-accent sm:text-[7rem]">
        404
      </span>
      <h2 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">
        {t.title}
      </h2>
      <p className="max-w-sm text-foreground-secondary">{t.description}</p>

      <Button asChild size="lg" className="mt-3 px-8">
        <Link href={`/${lang}`}>{t.action}</Link>
      </Button>
    </div>
  );
}
