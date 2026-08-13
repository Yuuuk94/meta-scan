export const Loading = () => {
  return (
    <div className="mt-12 flex justify-center gap-3">
      <div className="h-3 w-3 animate-bounce rounded-full bg-primary" />
      <div className="h-3 w-3 animate-bounce rounded-full bg-primary/70 [animation-delay:0.1s]" />
      <div className="h-3 w-3 animate-bounce rounded-full bg-primary/40 [animation-delay:0.2s]" />
    </div>
  );
};
