import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolveBackgroundImage(image: string, overlay: string) {
  const source = image.trim();
  const isGradientSource = source.includes("gradient(");

  return isGradientSource ? `${overlay}, ${source}` : `${overlay}, url("${source}")`;
}
