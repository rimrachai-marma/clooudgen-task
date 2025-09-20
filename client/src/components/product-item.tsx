import React from "react";

import Image from "next/image";
import { Card, CardContent, CardHeader } from "./ui/card";
import Link from "next/link";
import { Product } from "@/lib/types/products";
import { formatCurrency, getPrimaryImage } from "@/lib/utils";

interface Props {
  product: Product;
}

const ProductItem: React.FC<Props> = ({ product }) => {
  const primaryImage = getPrimaryImage(product.images);
  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="pt-0 pb-4 gap-3 overflow-hidden rounded-sm">
        <CardHeader className="relative aspect-video">
          <Image
            src={primaryImage?.url || "/images/logo.png"}
            alt={primaryImage?.alt || ""}
            className="object-cover"
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            priority={true}
          />
        </CardHeader>

        <CardContent className="text-gray-800">
          <h3 className="truncate text-xl font-semibold">{product.name}</h3>
          <p className="text-md font-bold">
            {formatCurrency(product.price, "USD")}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};
export default ProductItem;
