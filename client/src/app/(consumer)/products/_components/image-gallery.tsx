"use client";

import { ProductImage } from "@/lib/types/product";
import Image from "next/image";
import React from "react";

interface Props {
  images: ProductImage[];
}

const ImageGallery: React.FC<Props> = ({ images }) => {
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  return (
    <div className="space-y-4">
      <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={images[selectedImageIndex].url}
          alt={images[selectedImageIndex].alt}
          className="object-cover"
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          priority={true}
        />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImageIndex(index)}
            className={`aspect-square relative bg-gray-100 rounded-md overflow-hidden border-2 cursor-pointer ${
              selectedImageIndex === index
                ? "border-gray-600"
                : "border-transparent"
            }`}
          >
            <Image
              src={image.url}
              alt={image.alt}
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              priority={true}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
