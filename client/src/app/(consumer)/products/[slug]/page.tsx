import React from "react";
import ImageGallery from "../_components/image-gallery";
import ProductInfo from "../_components/product-info";
import ProductDetailsTabs from "../_components/product-details-tabs";
import { getProduct } from "@/lib/actions/products";

export default async function ProductDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const product = await getProduct(params.slug);

  if (!product) {
    return <h1>Product not found</h1>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Image Gallery */}
        <ImageGallery images={product.images} />

        {/* Product Information */}
        <ProductInfo product={product} />
      </div>

      {/* Product Details Tabs */}
      <ProductDetailsTabs product={product} />
    </div>
  );
}
