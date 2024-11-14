import dayjs from "dayjs";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidUUID(uuid : string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

interface Options {
  url?: string;
  query?: Record<string, string | null | undefined >;
  hash?: string | null | undefined;
}

/**
 * Builds a URL with the given options.
 * @param options - The options object containing the URL, query parameters, and hash.
 * @returns The constructed URL as a string.
 */
export function buildURL(options: Options): string {
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

  // Return the updated URL
  return urlObj.toString();
}

export function getTimestamp(date : Date) {
  return `${dayjs(date).hour().toString().padStart(2,"0")}:${dayjs(date).minute().toString().padStart(2,"0")}`;
}

export function makeHumanReadable(value : number) {
  const units = ["", "K", "M", "G", "T", "P", "E"];
  const base = 1000;

  let exponent = 0;
  while (value >= base && exponent < units.length) {
    value /= base;
    exponent++;
  }

  return `${value.toFixed(2)}${units[exponent]}`;
}

export function range(start: number, end: number) {
  const length = end - start + 1;
  return Array.from({ length }, (_, index) => index + start);
}
