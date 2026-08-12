interface UrlData {
  url: string;
}

interface HasData {
  has: boolean;
}

interface RedirectedData {
  redirected: boolean;
}
interface SiteStatusData extends OkStatus, UrlData, RedirectedData {}

interface RobotsTxtData extends OkStatus, HasData {
  url?: string;
  redirected?: boolean;
  allow?: Record<string, boolean>;
  contents?: string;
  sitemap?: string[];
}

interface SiteMapData extends OkStatus, HasData {
  url?: string;
  redirected?: boolean;
}
