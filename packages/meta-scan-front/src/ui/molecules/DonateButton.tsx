import { Button } from "@/ui/atoms/Button";
import { CupIcon } from "@/ui/atoms/CupIcon";

// Header Ko-fi link (issue #63). Same env gating as AutoAdsScript: unset or
// empty `NEXT_PUBLIC_KOFI_URL` renders nothing. One element: 40px icon-only
// square below `sm`, 36px icon + label from `sm` up.
interface DonateButtonProps {
  label: string;
  ariaLabel: string;
}

export const DonateButton = ({ label, ariaLabel }: DonateButtonProps) => {
  const url = process.env.NEXT_PUBLIC_KOFI_URL;
  if (!url) return null;

  return (
    <Button
      asChild
      variant="support"
      className="size-10 text-[13px] font-bold tracking-[.04em] sm:h-9 sm:w-auto sm:px-3.5 sm:has-[>svg]:px-3.5"
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
      >
        <CupIcon className="size-[18px] sm:size-4" />
        <span className="hidden sm:inline">{label}</span>
      </a>
    </Button>
  );
};
