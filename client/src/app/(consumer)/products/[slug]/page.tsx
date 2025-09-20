import React from "react";
import { notFound } from "next/navigation";

import ImageGallery from "../_components/image-gallery";
import ProductInfo from "../_components/product-info";
import ProductDetailsTabs from "../_components/product-details-tabs";
import { getProduct } from "@/lib/actions/products";

export default async function ProductDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const productData = await getProduct(params.slug);

  if (!productData) {
    return null;
  }

  if (!productData.product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Image Gallery */}
        <ImageGallery images={productData.product.images} />

        {/* Product Information */}
        <ProductInfo product={productData.product} />
      </div>

      {/* Product Details Tabs */}
      <ProductDetailsTabs product={productData.product} />
    </div>
  );
}
