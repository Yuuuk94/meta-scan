import { getSiteSetting } from "@/utils/cookies";

export const RootBackground = async ({
  theme,
  children,
}: Readonly<{
  theme: Theme;
  children: React.ReactNode;
}>) => {
  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-black to-purple-900"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
      }`}
    >
      {/* Background Grid Pattern */}
      {children}
    </div>
  );
};
