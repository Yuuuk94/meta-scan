interface UrlData {
  url: string;
}

interface SiteStatus extends OkStatus, UrlData {
  redirected: boolean;
}
