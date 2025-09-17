import {
  ProductDimensions,
  ProductImage,
  ProductSpecifications,
} from "./product";

export interface Review {
  _id: string;
  user: string;
  comment: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  user: string;
  slug: string;
  name: string;
  images: ProductImage[];
  brand: string;
  categories: string[];
  description: string;
  shortDescription?: string;
  seoTitle?: string;
  seoDescription?: string;
  specifications?: ProductSpecifications;
  weight?: number;
  dimensions?: ProductDimensions;
  reviews?: Review[];
  rating: number;
  numReviews: number;
  price: number;
  comparePrice?: number;
  costPrice?: number; // Admin only - for profit calculation
  countInStock: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Pagination {
  page: number;
  pages: number;
  pageSize: number;
  total: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface Filters {
  keyword: string | null;
  brands: string[] | null;
  category: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  inStock: boolean | null;
  rating: number | null;
  featured: boolean | null;
}

export interface Sort {
  field: "created" | "newest" | "updated" | "name" | "price" | "rating";
  order: "asc" | "desc";
}

export interface ProductListResponse {
  products: Product[];
  pagination: Pagination;
  filters: Filters;
  sort: Sort;
}
