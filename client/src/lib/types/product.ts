export interface ReviewUser {
  name: string;
  email: string;
}

export interface Review {
  _id: string;
  user: ReviewUser;
  comment: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  _id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
  publicId?: string;
}

export interface ProductDimensions {
  length?: number;
  width?: number;
  height?: number;
  unit: "cm" | "in";
}

export interface ProductSpecifications {
  [key: string]: string;
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
