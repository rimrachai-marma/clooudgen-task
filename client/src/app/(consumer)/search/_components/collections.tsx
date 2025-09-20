"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

export default function Collections() {
  const pathname = usePathname();

  return (
    <nav>
      <h3 className="hidden text-xs text-neutral-500 md:block">Collections</h3>
      <ul className="hidden md:block text-sm leading-relaxed">
        {collectionLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <li key={link.name}>
              <Link href={link.href} className={isActive ? "underline" : ""}>
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>
      <ul className="md:hidden flex flex-wrap gap-2.5 text-sm leading-relaxed">
        {collectionLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <li key={link.name}>
              <Link href={link.href} className={isActive ? "underline" : ""}>
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
