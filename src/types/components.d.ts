type Language = "en" | "ko";
type Theme = "dark" | "light";

interface DefautPageProps extends DefautProps {
  t: Record<string, string | string[]>;
}
interface DefautProps {
  theme: Theme;
  lang: Language;
}
