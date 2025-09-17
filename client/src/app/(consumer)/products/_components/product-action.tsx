"use client";

import { Button } from "@/components/ui/button";
import { Heart, Minus, Plus, Share2, ShoppingCart } from "lucide-react";
import React from "react";

interface Props {
  id: string;
  countInStock: number;
}

const ProductAction: React.FC<Props> = ({ countInStock }) => {
  const [quantity, setQuantity] = React.useState(1);
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= countInStock) {
      setQuantity(newQuantity);
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="font-medium text-gray-900">Quantity:</span>
        <div className="flex items-center border border-gray-300 rounded-md">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="px-4 py-2 font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= countInStock}
            className="cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          disabled={countInStock === 0}
          className="cursor-pointer flex-1 bg-neutral-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </button>
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`cursor-pointer px-6 py-3 rounded-lg border-2 font-medium transition-colors flex items-center justify-center gap-2 ${
            isWishlisted
              ? "border-red-500 text-red-500 bg-red-50"
              : "border-gray-300 text-gray-700 hover:border-gray-400"
          }`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
          <span className="hidden sm:inline">Wishlist</span>
        </button>
        <button className="cursor-pointer px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:border-gray-400 font-medium flex items-center justify-center gap-2">
          <Share2 className="w-5 h-5" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>
    </div>
  );
};

export default ProductAction;
