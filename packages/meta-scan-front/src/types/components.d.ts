type Language = "en" | "ko";
type Theme = "dark" | "light";

/** ServiceStatus badge state (issue #44 root-ping-cold-start).
 * - "online" — pingApi settled with status "ok".
 * - "off" — pingApi settled as a confirmed failure (non-"ok" status, or a
 *   rejection — either from RootLayout's SSR race or a CSR retry).
 * - "pending" — RootLayout's SSR pingApi race didn't settle within the
 *   300ms timeout; not a new visual state, `<ServiceStatus>` renders this
 *   with the existing WARNING look and retries once on the client. */
type ServiceReadyStatus = "online" | "off" | "pending";

interface DefaultPageProps extends DefaultProps {
  t: Record<string, string | string[]>;
}
interface DefaultProps {
  theme: Theme;
  lang: Language;
}
