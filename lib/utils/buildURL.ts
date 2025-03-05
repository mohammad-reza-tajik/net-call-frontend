
interface IOptions {
    url?: string;
    query?: Record<string, string | null | undefined >;
    hash?: string | null | undefined;
}

/**
 * Builds a URL with the given options.
 * @param options - The options object containing the URL, query parameters, and hash.
 * @returns The constructed URL as a string.
 */
function buildURL(options: IOptions): string {
    // Use the current URL if no URL is provided
    let url = options.url || window.location.href;

    // If the URL starts with '/', consider it a path relative to the current URL
    if (url.startsWith("/")) {
        url = new URL(window.location.origin + url).href;
    }
    // Parse the URL
    const urlObj = new URL(url);

    // Set query parameters
    if (options.query) {
        for (const [key, value] of Object.entries(options.query)) {
            if (value !== null && value !== undefined) {
                urlObj.searchParams.set(key, value);
            } else {
                urlObj.searchParams.delete(key);
            }
        }
    }

    // Set the hash
    if (options.hash !== null && options.hash !== undefined) {
        urlObj.hash = options.hash;
    } else {
        urlObj.hash = "";
    }

    if (!options.url) {
        return `${urlObj.search}${urlObj.hash}`;
    }
    // Return the updated URL
    return urlObj.toString();
}

export default buildURL;