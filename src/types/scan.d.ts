interface UrlData {
  url: string;
}

interface SitePingData extends OkStatus, UrlData {
  redirected: boolean;
}
