import Product from "../models/product.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorResponse from "../utilities/errorResponse.js";
import {
  clearProductCaches,
  generateCacheKey,
  generateSlug,
} from "../utilities/helper.js";
import cacheService from "../services/redis/cache.js";
import { CACHE_TTL } from "../utilities/constants.js";

// @desc    Create a new product
// @route   POST /api/admin/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const { name } = req.validatedData;
  const slug = generateSlug(name);

  const newProduct = await Product.create({
    user: req.user._id,
    slug,
    ...req.validatedData,
  });

  await clearProductCaches();

  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    data: {
      product: newProduct,
    },
  });
});

// @desc    Fetch all products, with pagination, search keyword and filtering
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const cacheKey = generateCacheKey("products", req.query);
  const cachedResult = await cacheService.get(cacheKey);

  if (cachedResult) {
    return res.status(200).json({
      status: "success",
      ...cachedResult,
      cached: true,
    });
  }

  const defaultPageSize = parseInt(process.env.PAGINATION_LIMIT, 10) || 12;
  const pageSize = Math.max(
    1,
    parseInt(req.query.pageSize, 10) || defaultPageSize
  );
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);

  const query = { isActive: true }; // Only show active products
  let sort = { createdAt: -1 };

  //search keyword
  //keyword=[Somthing]
  if (req.query.keyword && req.query.keyword.trim()) {
    const keyword = req.query.keyword.trim();

    query.$or = [
      { name: { $regex: keyword, $options: "i" } },
      { brand: { $regex: keyword, $options: "i" } },
      { shortDescription: { $regex: keyword, $options: "i" } },
      { categories: { $elemMatch: { $regex: keyword, $options: "i" } } },
    ];
  }

  // filter by brand
  //brand=[Somthing]
  if (req.query.brands) {
    query.brand = {
      $in: req.query.brands
        .split(",")
        .map((brand) => decodeURIComponent(brand).trim())
        .filter(Boolean),
    };
  }

  // filter  by category
  //category=[Somthing]
  if (req.query.category) {
    query.categories = { $in: [decodeURIComponent(req.query.category).trim()] };
  }

  // Filter by available in stock
  // in_stock=1 or in_stock=0
  if (req.query.in_stock) {
    if (req.query.in_stock === "1") {
      query.countInStock = { $gt: 0 };
    } else if (req.query.in_stock === "0") {
      query.countInStock = { $eq: 0 };
    }
  }

  // Filter by minimum rating
  // rating=4 (means >= 4)
  if (req.query.rating) {
    const minRating = parseInt(req.query.rating, 10);
    if (!isNaN(minRating)) {
      query.rating = { $gte: minRating };
    }
  }

  // filter by price min max price
  // min_price=100&max_price=500
  const minPrice = parseInt(req.query.min_price, 10);
  const maxPrice = parseInt(req.query.max_price, 10);
  if (!isNaN(minPrice) || !isNaN(maxPrice)) {
    query.price = {};
    if (!isNaN(minPrice)) {
      query.price.$gte = minPrice;
    }
    if (!isNaN(maxPrice)) {
      query.price.$lte = maxPrice;
    }
  }

  // Filter by featured products
  // featured=1
  if (req.query.featured === "1") {
    query.isFeatured = true;
  }

  //sorting
  // sort=price&order=desc

  if (
    req.query.sort &&
    (req.query.order === "asc" || req.query.order === "desc")
  ) {
    const sortField = req.query.sort.toLowerCase();
    const order = req.query.order === "asc" ? 1 : -1;

    const sortMap = {
      price: { price: order },
      rating: { rating: order },
      name: { name: order },
      created: { createdAt: order },
      newest: { createdAt: order },
      updated: { updatedAt: order },
    };

    sort = sortMap[sortField] || sort;
  }

  const results = await Product.aggregate([
    { $match: query },
    { $sort: sort },

    {
      $project: {
        costPrice: 0,
        reviews: 0,
        user: 0,
      },
    },

    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: pageSize * (page - 1) }, { $limit: pageSize }],
      },
    },
  ]);

  const products = results[0].data;
  const count = results[0].metadata[0] ? results[0].metadata[0].total : 0;
  const pages = Math.ceil(count / pageSize);

  const responseData = {
    data: {
      products,
      pagination: {
        page,
        pages,
        pageSize,
        total: count,
        hasNextPage: page < pages,
        hasPrevPage: page > 1,
      },
      filters: {
        keyword: req.query.keyword || null,
        brands: req.query.brands?.split(",") || null,
        category: req.query.category || null,
        min_price: !isNaN(minPrice) ? minPrice : null,
        max_price: !isNaN(maxPrice) ? maxPrice : null,
        inStock: req.query.in_stock || null,
        rating: req.query.rating || null,
        featured: req.query.featured || null,
      },
      sort: {
        field: req.query.sort || "created",
        order: req.query.order || "desc",
      },
    },
  };

  // shorter TTL for search results, longer for general listings
  const ttl = req.query.keyword
    ? CACHE_TTL.PRODUCT_LIST / 2
    : CACHE_TTL.PRODUCT_LIST;
  await cacheService.set(cacheKey, responseData, ttl);

  res.status(200).json({
    status: "success",
    ...responseData,
    cached: false,
  });
});

// @desc    Fetch single product
// @route   GET /api/products/:slug
// @access  Public
export const getProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const cacheKey = `product:${slug}`;

  const { data, cached } = await cacheService.getOrSet(cacheKey, async () => {
    const product = await Product.findOne({ slug }).populate({
      path: "reviews",
      populate: {
        path: "user",
        select: "name email",
      },
    });

    if (!product) {
      throw new ErrorResponse("Product not found", 404);
    }

    return product;
  });

  res.status(200).json({
    status: "success",
    data: {
      product: data,
    },
    cached,
  });
});
