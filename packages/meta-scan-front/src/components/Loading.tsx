export const Loading = ({ theme }: DefaultProps) => {
  return (
    <div className="mt-12 flex justify-center space-x-3">
      <div
        className={`w-3 h-3 rounded-full animate-bounce ${
          theme === "dark"
            ? "bg-cyan-400 shadow-lg shadow-cyan-400/50"
            : "bg-blue-500"
        }`}
      ></div>
      <div
        className={`w-3 h-3 rounded-full animate-bounce [animation-delay:0.1s] ${
          theme === "dark"
            ? "bg-purple-400 shadow-lg shadow-purple-400/50"
            : "bg-purple-500"
        }`}
      ></div>
      <div
        className={`w-3 h-3 rounded-full animate-bounce [animation-delay:0.2s] ${
          theme === "dark"
            ? "bg-pink-400 shadow-lg shadow-pink-400/50"
            : "bg-blue-500"
        }`}
      ></div>
    </div>
  );
};
