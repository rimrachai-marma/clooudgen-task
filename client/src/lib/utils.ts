import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ProductImage } from "./types/product";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPrimaryImage(images: ProductImage[]) {
  if (!images || images.length === 0) {
    return null;
  }
  const primaryImage = images.find((img) => img?.isPrimary === true);

  return primaryImage || images[0];
}

export const formatCurrency = (
  amount: number,
  currency: string,
  locale?: string
): string => {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });

  return formatter.format(amount);
};
