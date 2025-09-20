import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center max-w-sm">
      <h2 className="text-2xl font-medium text-gray-900 mb-2">
        Product not found
      </h2>
      <p className="text-gray-500 text-sm mb-8">
        The item you are looking for does not exist!
      </p>
      <Link
        href="/search"
        className="bg-blue-500 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors duration-200"
      >
        Browse products
      </Link>
    </div>
  );
}
