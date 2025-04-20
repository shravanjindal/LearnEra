export interface LinkPreview {
    url: string;
    domain: string;
    title: string;
    favicon: string;
  }
  
  export function getLinkPreview(url: string): LinkPreview {
    const domain = new URL(url).hostname.replace(/^www\./, "");
    const title = domain.charAt(0).toUpperCase() + domain.slice(1); // simple fake title
    const favicon = `https://www.google.com/s2/favicons?sz=64&domain_url=${url}`;
  
    return {
      url,
      domain,
      title,
      favicon,
    };
  }