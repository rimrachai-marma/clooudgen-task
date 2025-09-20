import { Product } from "@/lib/types/product";
import { RotateCcw, Shield, Truck } from "lucide-react";
import React from "react";
import StarRating from "./star-rating";
import ProductAction from "./product-action";
import { formatCurrency } from "@/lib/utils";

interface Props {
  product: Product;
}

const ProductInfo: React.FC<Props> = ({ product }) => {
  const discountPercentage = product.comparePrice
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100
      )
    : 0;

  return (
    <div className="space-y-6">
      {/* Brand & Title */}
      <div className="space-y-1">
        <p className="text-sm text-gray-600 font-medium">{product.brand}</p>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          {product.name}
        </h1>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {product.categories.map((category, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
          >
            {category}
          </span>
        ))}
      </div>

      {/* Rating & Reviews */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <StarRating rating={product.rating} />
        </div>
        <span className="font-medium text-gray-900">{product.rating}</span>
        <span className="text-gray-500">({product.numReviews} reviews)</span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-gray-900">
          {formatCurrency(product.price, "USD")}
        </span>
        {product.comparePrice && product.price < product.comparePrice && (
          <>
            <span className="text-lg text-gray-500 line-through">
              {formatCurrency(product.comparePrice, "USD")}
            </span>
            <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
              {discountPercentage}% OFF
            </span>
          </>
        )}
      </div>

      {/* Short Description */}
      {product.shortDescription && (
        <p className="text-gray-600 leading-relaxed">
          {product.shortDescription}
        </p>
      )}

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {product.countInStock > 0 ? (
          <span className="font-medium text-green-600">
            {product.countInStock} in stock
          </span>
        ) : (
          <span className="text-green-600">Out of stock</span>
        )}
      </div>

      {/* Quantity & Actions */}
      <ProductAction id={product._id} countInStock={product.countInStock} />

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Truck className="w-4 h-4" />
          <span>Free Shipping</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <RotateCcw className="w-4 h-4" />
          <span>30-day Returns</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Shield className="w-4 h-4" />
          <span>2-year Warranty</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
