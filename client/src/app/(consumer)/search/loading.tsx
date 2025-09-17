import React from "react";

import ProductItemSkeleton from "@/components/produc-tItem-skeleton";

export default function Loading() {
  return (
    <div className="grid grid-flow-row gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <ProductItemSkeleton />
      <ProductItemSkeleton />
      <ProductItemSkeleton />
      <ProductItemSkeleton />
      <ProductItemSkeleton />
      <ProductItemSkeleton />
      <ProductItemSkeleton />
      <ProductItemSkeleton />
      <ProductItemSkeleton />
    </div>
  );
}
