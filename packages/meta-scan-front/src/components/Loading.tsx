// design-system.md §6 explicitly bans "바운스 애니메이션" as decorative motion
// (motion density is 2/10 — "Static Restrained"); this previously used
// animate-bounce, which is that exact banned pattern. Swapped for a plain
// opacity pulse, which reads as "loading" without the bouncy, playful motion
// the system's anti-pattern list rules out.
export const Loading = () => {
  return (
    <div className="mt-12 flex justify-center gap-3">
      <div className="h-3 w-3 animate-pulse bg-primary" />
      <div className="h-3 w-3 animate-pulse bg-primary/70 [animation-delay:0.15s]" />
      <div className="h-3 w-3 animate-pulse bg-primary/40 [animation-delay:0.3s]" />
    </div>
  );
};
