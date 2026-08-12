export const setDocumentCookies = (key: string, value: string, path = "/") => {
  document.cookie = `${key}=${value}; path=${path};`;
};
