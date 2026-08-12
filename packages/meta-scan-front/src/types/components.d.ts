type Language = "en" | "ko";
type Theme = "dark" | "light";

interface DefaultPageProps extends DefaultProps {
  t: Record<string, string | string[]>;
}
interface DefaultProps {
  theme: Theme;
  lang: Language;
}
