import { Button } from "@/ui/atoms/Button";
import { CupIcon } from "@/ui/atoms/CupIcon";

// Bottom-of-result Ko-fi block (issue #63). Gated on `NEXT_PUBLIC_KOFI_URL`
// like the header button — it exists only to carry the link, so unset/empty
// renders nothing at all. Stacked below `sm`, 12-col grid from `sm` up.
export const SupportBlock = ({ t }: Pick<DefaultPageProps, "t">) => {
  const url = process.env.NEXT_PUBLIC_KOFI_URL;
  if (!url) return null;

  return (
    <section className="mt-8 flex flex-col gap-4 border-t-4 border-foreground bg-card-paper px-5 py-6 sm:grid sm:grid-cols-12 sm:items-center sm:gap-x-6 sm:px-10 sm:py-8">
      <CupIcon
        strokeWidth={1.5}
        className="size-12 text-accent sm:col-span-2 sm:size-[88px]"
      />
      <div className="flex flex-col gap-2 sm:col-span-7">
        <span className="text-xs font-bold tracking-[.08em] text-foreground-secondary">
          {t.supportEyebrow}
        </span>
        <h2 className="font-display text-[28px] font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-4xl">
          {t.supportTitle}
        </h2>
        <p className="text-[15px] leading-relaxed text-foreground-secondary">
          {t.supportBody}
        </p>
      </div>
      <div className="flex sm:col-span-3 sm:justify-end">
        <Button
          asChild
          variant="support"
          className="h-[52px] w-full gap-2.5 px-[22px] text-[15px] font-bold tracking-[.02em] sm:w-auto"
        >
          <a href={url} target="_blank" rel="noopener noreferrer">
            <CupIcon className="size-[18px]" />
            {t.supportButton}
          </a>
        </Button>
      </div>
    </section>
  );
};
