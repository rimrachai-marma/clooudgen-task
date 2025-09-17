"use client";
import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Plus, X, Star } from "lucide-react";

// Schemas
const imageSchema = z.object({
  url: z.string().trim().min(1, "Image URL is required"),
  alt: z.string().trim().optional().default(""),
  isPrimary: z.boolean().optional().default(false),
  order: z.number().min(0, "Order must be non-negative").optional().default(0),
  publicId: z.string().trim().optional(),
});

const dimensionsSchema = z.object({
  length: z.number().min(0, "Length must be non-negative").optional(),
  width: z.number().min(0, "Width must be non-negative").optional(),
  height: z.number().min(0, "Height must be non-negative").optional(),
  unit: z.enum(["cm", "in"]).default("cm"),
});

const specificationSchema = z.object({
  key: z.string().trim().min(1, "Specification name is required"),
  value: z.string().trim().min(1, "Specification value is required"),
});

const productCreateSchema = z
  .object({
    name: z.string().trim().min(1, "Product name is required"),
    slug: z.string().toLowerCase().optional(),
    images: z
      .array(imageSchema)
      .min(1, "Product must have at least one image")
      .refine(
        (images) => {
          const primaryImages = images.filter((img) => img.isPrimary);
          return primaryImages.length <= 1;
        },
        {
          message: "Only one image can be marked as primary",
        }
      ),
    brand: z.string().trim().min(1, "Brand is required"),
    categories: z
      .array(z.string().trim().min(1, "Category cannot be empty"))
      .min(1, "Product must have at least one category"),
    description: z
      .string()
      .trim()
      .min(1, "Description is required")
      .max(2000, "Description cannot exceed 2000 characters"),
    shortDescription: z
      .string()
      .trim()
      .max(300, "Short description cannot exceed 300 characters")
      .optional(),
    seoTitle: z
      .string()
      .trim()
      .max(60, "SEO title cannot exceed 60 characters")
      .optional(),
    seoDescription: z
      .string()
      .trim()
      .max(160, "SEO description cannot exceed 160 characters")
      .optional(),
    specifications: z.array(specificationSchema).optional(),
    weight: z.number().min(0, "Weight cannot be negative").optional(),
    dimensions: dimensionsSchema.optional(),
    price: z.number().min(0, "Price cannot be negative"),
    comparePrice: z
      .number()
      .min(0, "Compare price cannot be negative")
      .optional(),
    costPrice: z.number().min(0, "Cost price cannot be negative").optional(),
    countInStock: z
      .number()
      .min(0, "Stock count cannot be negative")
      .default(0),
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.comparePrice && data.price && data.comparePrice < data.price) {
      ctx.addIssue({
        code: "custom",
        message:
          "Compare price should be greater than or equal to selling price",
        path: ["comparePrice"],
      });
    }
  });

type ProductFormData = z.infer<typeof productCreateSchema>;

export default function ProductCreateForm() {
  const [newCategory, setNewCategory] = useState("");

  const form = useForm({
    resolver: zodResolver(productCreateSchema),
    defaultValues: {
      name: "",
      slug: "",
      images: [{ url: "", alt: "", isPrimary: true, order: 0 }],
      brand: "",
      categories: [],
      description: "",
      shortDescription: "",
      seoTitle: "",
      seoDescription: "",
      specifications: [{ key: "", value: "" }],
      weight: undefined,
      dimensions: {
        length: undefined,
        width: undefined,
        height: undefined,
        unit: "cm",
      },
      price: 0,
      comparePrice: undefined,
      costPrice: undefined,
      countInStock: 0,
      isActive: true,
      isFeatured: false,
    },
  });

  const registeredCategories = form.watch("categories", []);

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control: form.control,
    name: "images",
  });

  const {
    fields: specFields,
    append: appendSpec,
    remove: removeSpec,
  } = useFieldArray({
    control: form.control,
    name: "specifications",
  });

  const addCategory = () => {
    if (
      newCategory.trim() &&
      !registeredCategories.includes(newCategory.trim())
    ) {
      const updatedCategories = [...registeredCategories, newCategory.trim()];
      form.setValue("categories", updatedCategories, { shouldValidate: true });
      setNewCategory("");
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    const updatedCategories = registeredCategories.filter(
      (cat) => cat !== categoryToRemove
    );
    form.setValue("categories", updatedCategories, { shouldValidate: true });
  };

  const onSubmit = (data: ProductFormData) => {
    // Transform specifications from an array of objects to a single record object
    const specificationsObject = data.specifications?.reduce((acc, spec) => {
      if (spec.key && spec.value) {
        acc[spec.key] = spec.value;
      }
      return acc;
    }, {} as Record<string, string>);

    const finalData = {
      ...data,
      specifications: specificationsObject,
    };

    console.log("Form submitted:", finalData);
    // Handle form submission with the finalData object
  };

  const generateSlug = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    form.setValue("slug", slug);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
        <p className="text-gray-600 mt-2">Add a new product to your catalog</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details about your product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter product name"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            generateSlug(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="product-url-slug" {...field} />
                      </FormControl>
                      <FormDescription>
                        Auto-generated from product name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter brand name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categories *</FormLabel>
                    <div className="flex gap-2 mt-2 mb-3">
                      <Input
                        placeholder="Add category"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addCategory();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={addCategory}
                        variant="outline"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                    <div className="flex flex-wrap gap-2">
                      {registeredCategories.map((category, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {category}
                          <button
                            type="button"
                            onClick={() => removeCategory(category)}
                            className="ml-1 hover:bg-red-500 hover:text-white rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>
                Add images for your product. Mark one as primary.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {imageFields.map((field, index) => (
                  <div key={field.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-medium">Image {index + 1}</span>
                      <div className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name={`images.${index}.isPrimary`}
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormControl>
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                  <Star className="h-4 w-4 text-yellow-500" />
                                  <span className="text-sm">Primary</span>
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        {imageFields.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name={`images.${index}.url`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com/image.jpg"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`images.${index}.alt`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Alt Text</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Image description"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`images.${index}.order`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Order</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    appendImage({
                      url: "",
                      alt: "",
                      isPrimary: false,
                      order: imageFields.length,
                    })
                  }
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Image
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Descriptions */}
          <Card>
            <CardHeader>
              <CardTitle>Product Description</CardTitle>
              <CardDescription>
                Provide detailed information about your product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter detailed product description"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value?.length || 0}/2000 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief product summary"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value?.length || 0}/300 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Optimize your product for search engines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="seoTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO Title</FormLabel>
                    <FormControl>
                      <Input placeholder="SEO optimized title" {...field} />
                    </FormControl>
                    <FormDescription>
                      {field.value?.length || 0}/60 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seoDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="SEO meta description" {...field} />
                    </FormControl>
                    <FormDescription>
                      {field.value?.length || 0}/160 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Product Specifications</CardTitle>
              <CardDescription>
                Add technical specifications and features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {specFields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-start">
                    <FormField
                      control={form.control}
                      name={`specifications.${index}.key`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="Specification name (e.g., Color)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`specifications.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="Specification value (e.g., Red)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {specFields.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeSpec(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendSpec({ key: "", value: "" })}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Specification
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Physical Properties */}
          <Card>
            <CardHeader>
              <CardTitle>Physical Properties</CardTitle>
              <CardDescription>
                Weight and dimensions information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            parseFloat(e.target.value) || undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormLabel>Dimensions</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="dimensions.length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Length</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                parseFloat(e.target.value) || undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dimensions.width"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Width</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                parseFloat(e.target.value) || undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dimensions.height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                parseFloat(e.target.value) || undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dimensions.unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cm">Centimeters</SelectItem>
                            <SelectItem value="in">Inches</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
              <CardDescription>
                Set pricing and manage inventory levels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selling Price * ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="comparePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Compare Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseFloat(e.target.value) || undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Original price for discount display
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="costPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseFloat(e.target.value) || undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Your cost for profit calculation
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="countInStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormDescription>Current inventory count</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Status Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
              <CardDescription>
                Control product visibility and features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <FormLabel>Active Status</FormLabel>
                  <FormDescription>
                    Make this product visible to customers
                  </FormDescription>
                </div>
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <FormLabel>Featured Product</FormLabel>
                  <FormDescription>
                    Show this product in featured sections
                  </FormDescription>
                </div>
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Save as Draft
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create Product
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
