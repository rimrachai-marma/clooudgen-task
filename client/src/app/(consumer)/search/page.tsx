import ProductItem from "@/components/product-item";
import { getProducts } from "@/lib/actions/products";
import Pagination from "./_components/pagination";

export default async function Search(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  const keyword = searchParams?.keyword as string | undefined;
  const page = searchParams?.page as string | undefined;

  const query: Record<string, string> = {};

  if (keyword) {
    query.keyword = keyword;
  }

  if (page) {
    query.page = page;
  }

  const productsData = await getProducts(query);

  if (!productsData) {
    return;
  }

  if (productsData.products.length < 1) {
    return (
      <div className="pt-8">
        <p className="text-2xl font-semibold text-center text-gray-500">
          😔 No Products found! Try adjusting your search.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
        All products
      </h1>
      <div className="grid grid-flow-row gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {productsData?.products.map((product) => (
          <ProductItem product={product} key={product._id} />
        ))}
      </div>

      <Pagination
        page={productsData.pagination.page}
        pages={productsData.pagination.pages}
      />
    </div>
  );
}
