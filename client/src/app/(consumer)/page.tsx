import Link from "next/link";

const collectionLinks = [
  { name: "All", href: "/search" },
  { name: "Electronics", href: "/search/electronics" },
  { name: "Smartphones", href: "/search/smartphones" },
  { name: "Laptops", href: "/search/laptops" },
  { name: "Headphones", href: "/search/headphones" },
  { name: "Fashion", href: "/search/fashion" },
  { name: "Clothing", href: "/search/clothing" },
  { name: "Shoes", href: "/search/shoes" },
  { name: "Home & Garden", href: "/search/home & garden" },
  { name: "Home & Kitchen", href: "/search/home & kitchen" },
];

export default async function Home() {
  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="font-bold text-5xl mt-12">Landing page</h1>
      <div className="flex gap-4 flex-wrap justify-center">
        {collectionLinks.map((link) => (
          <Link key={link.href} className="underline" href={link.href}>
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
