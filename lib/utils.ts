import dayjs from "dayjs";
import qs from "query-string";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,  (char) => {
    const randomValue = Math.random() * 16 | 0;
    const finalValue = char == "x" ? randomValue : (randomValue & 0x3 | 0x8);
    return finalValue.toString(16);
  });
}

export function isUUIDValid(uuid : string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

interface Config {
  currentParams? : string;
  params?: Record<string, string | number>;
  hash?:string;
}

export function formUrlQuery({params , currentParams = ""} : Config = {} ) : string {
  const query = qs.parse(currentParams);

  if (params) {
    Object.keys(params).forEach(key => {
      query[key] = String(params[key]);
    })
  }
  return qs.stringifyUrl({
    url: "",
    query: query
  }, {skipNull: true})

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

