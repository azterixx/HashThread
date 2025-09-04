import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCount(count: number) {
  if (count === 0) return "";
  if (count >= 1000) return `${Math.floor(count / 1000)}k`;
  return String(count);
}
