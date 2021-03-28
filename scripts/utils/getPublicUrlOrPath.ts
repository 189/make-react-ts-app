import { URL } from "url";


/**
 * Returns a URL or a path with slash at the end
 * In production can be URL, abolute path, relative path
 * In development always will be an absolute path
 * In development can use `path` module functions for operations
 *
 * @param {boolean} isEnvDevelopment
 * @param {(string|undefined)} homepage a valid url or pathname
 * @param {(string|undefined)} envPublicUrl a valid url or pathname
 * @returns {string}
 */
export default function getPublicUrlOrPath(isEnvDevelopment: boolean, homepage?: string, envPublicUrl?: string) {
  const stubDomain = 'https://create-react-app.dev';

  if (envPublicUrl) {
    // ensure last slash exists
    envPublicUrl = keepSlashEnd(envPublicUrl);
    // validate if `envPublicUrl` is a URL or path like
    // `stubDomain` is ignored if `envPublicUrl` contains a domain
    // http://nodejs.cn/api/url.html#url_new_url_input_base
    const validPublicUrl = new URL(envPublicUrl, stubDomain);

    return isEnvDevelopment ?
      envPublicUrl.startsWith('.')
        ? '/'
        : validPublicUrl.pathname
      :
      // Some apps do not use client-side routing with pushState.
      // For these, "homepage" can be set to "." to enable relative asset paths.
      envPublicUrl;
  }

  if (homepage) {
    // strip last slash if exists
    homepage = keepSlashEnd(homepage);

    // validate if `homepage` is a URL or path like and use just pathname
    const validHomepagePathname = new URL(homepage, stubDomain).pathname;
    return isEnvDevelopment
      ? homepage.startsWith('.')
        ? '/'
        : validHomepagePathname
      : // Some apps do not use client-side routing with pushState.
      // For these, "homepage" can be set to "." to enable relative asset paths.
      homepage.startsWith('.')
        ? homepage
        : validHomepagePathname;
  }

  return '/';
};


function keepSlashEnd(url: string): string {
  return url.endsWith("/") ? url : url + "/";
}
