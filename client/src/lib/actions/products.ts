import { env } from "@/data/env/server";
import { ProductListResponse } from "../types/products";
import { Product } from "../types/product";

// Configuration
const API_BASE_URL = env.API_BASE_URL;

export async function getProducts(
  query: Record<string, string>
): Promise<ProductListResponse | null> {
  const searchParams = new URLSearchParams(query).toString();

  let queryString = "";
  if (searchParams) {
    queryString += "?" + searchParams;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/products${queryString}`);
    const resData = await res.json();

    if (!res.ok) {
      return null;
    }

    return resData.data;
  } catch (error) {
    console.log("Prducts fetch error: ", error);
    return null;
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${slug}`);

    const resData = await res.json();

    if (!res.ok) {
      return null;
    }

    return resData.data.product;
  } catch (error) {
    console.log("Prduct fetch error: ", error);
    return null;
  }
}
