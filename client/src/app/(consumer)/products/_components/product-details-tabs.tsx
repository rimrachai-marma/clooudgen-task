"use client";

import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Product } from "@/lib/types/product";
import StarRating from "./star-rating";

interface Props {
  product: Product;
}

const ProductDetailsTabs: React.FC<Props> = ({ product }) => {
  const [activeTab, setActiveTab] = React.useState("description");
  console.log(product);

  return (
    <div className="space-y-6">
      {/* Tab navigations  */}
      <div className="border-b border-gray-300">
        <nav className="flex space-x-8">
          {["description", "specifications", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                activeTab === tab
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
              {tab === "reviews" && ` (${product.numReviews})`}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "description" && (
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed text-lg">
            {product.description}
          </p>
          {product.dimensions && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Dimensions</h3>
              <p className="text-gray-600 space-x-1">
                <span>{product.dimensions.length}</span>
                <span>&#215;</span>
                <span>{product.dimensions.width}</span>
                <span>&#215;</span>
                <span>{product.dimensions.height}</span>
                <span>&#215;</span>
                <span>{product.dimensions.unit}</span>
                {product.weight && <span>• Weight {product.weight}g</span>}
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "specifications" && product.specifications && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(product.specifications).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between py-3 border-b border-gray-100"
            >
              <span className="font-medium text-gray-900">{key}</span>
              <span className="text-gray-600">{value}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="space-y-8">
          {product?.reviews && product?.reviews.length > 0 ? (
            <>
              <div className="flex flex-col gap-2">
                <div className="text-4xl font-bold text-gray-900">
                  {product.rating}
                </div>
                <div className="flex items-center gap-1">
                  <StarRating rating={product.rating} />
                </div>
                <div className="text-sm text-gray-500">
                  Based on {product.numReviews} reviews
                </div>
              </div>
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="border-b border-gray-100 pb-6"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="font-medium text-gray-600">
                          {review.user?.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {review.user?.name}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <StarRating
                              rating={product.rating}
                              size="w-3.5 h-3.5"
                            />
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <Alert>
              <AlertDescription>
                No reviews yet. Be the first to review this product!
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetailsTabs;
