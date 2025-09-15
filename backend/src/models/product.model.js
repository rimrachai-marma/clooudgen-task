import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },

    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
  },
  {
    timestamps: true,
  }
);

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true,
  },
  alt: {
    type: String,
    default: "",
    trim: true,
  },
  isPrimary: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
    min: 0,
  },

  // For cloud storage management
  publicId: {
    type: String, // Cloudinary/AWS public ID for deletion
    trim: true,
  },
});

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    images: {
      type: [imageSchema],
      validate: {
        validator: function (images) {
          return images && images.length > 0;
        },
        message: "Product must have at least one image",
      },
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    categories: {
      type: [String],
      required: true,
      validate: {
        validator: function (categories) {
          return categories && categories.length > 0;
        },
        message: "Product must have at least one category",
      },
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [300, "Short description cannot exceed 300 characters"],
    },

    seoTitle: {
      type: String,
      trim: true,
      maxlength: [60, "SEO title cannot exceed 60 characters"],
    },
    seoDescription: {
      type: String,
      trim: true,
      maxlength: [160, "SEO description cannot exceed 160 characters"],
    },

    specifications: {
      type: Map,
      of: String, // {"Processor": "Intel i7-12700K", "RAM": "32GB DDR4", "Storage": "1TB NVMe SSD"}
    },

    weight: {
      type: Number,
      min: [0, "Weight cannot be negative"],
    },
    dimensions: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
      unit: { type: String, enum: ["cm", "in"], default: "cm" },
    },

    reviews: [reviewSchema],
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot exceed 5"],
      index: true,
    },
    numReviews: {
      type: Number,
      default: 0,
      min: [0, "Number of reviews cannot be negative"],
    },

    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    comparePrice: {
      type: Number,
      min: [0, "Compare price cannot be negative"],
    },
    costPrice: {
      type: Number, // Cost price for profit calculation (admin only)
      min: [0, "Cost price cannot be negative"],
    },

    countInStock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Stock count cannot be negative"],
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.index({ name: "text", brand: "text" });
productSchema.index({ createdAt: -1 });
productSchema.index({ price: 1, isActive: 1 });
productSchema.index({ categories: 1, isActive: 1 });
productSchema.index({ brand: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ rating: -1, isActive: 1 });

productSchema.virtual("primaryImage").get(function () {
  if (!this.images || this.images.length === 0) return null;
  const primary = this.images.find((img) => img.isPrimary);
  return primary || this.images[0];
});

productSchema.pre("save", function (next) {
  // Ensure only one primary image
  if (this.images && this.images.length > 0) {
    const primaryImages = this.images.filter((img) => img.isPrimary);
    if (primaryImages.length > 1) {
      // Keep only the first primary image
      this.images.forEach((img, index) => {
        if (img.isPrimary && index > 0) {
          img.isPrimary = false;
        }
      });
    } else if (primaryImages.length === 0) {
      // Set first image as primary if none exists
      this.images[0].isPrimary = true;
    }
  }

  // Update rating and numReviews based on reviews array
  if (this.reviews && this.reviews.length > 0) {
    this.rating =
      this.reviews.reduce((sum, review) => sum + review.rating, 0) /
      this.reviews.length;

    this.numReviews = this.reviews.length;
  } else {
    this.rating = 0;
    this.numReviews = 0;
  }

  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
