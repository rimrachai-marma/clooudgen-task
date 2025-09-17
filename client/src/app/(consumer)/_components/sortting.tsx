"use client";

export default function Sorting() {
  return (
    <div>
      <h3 className="hidden text-xs text-neutral-500 md:block">Sort by</h3>
      <ul className="hidden md:block text-sm leading-relaxed">
        <li>Relevance</li>
        <li>Latest arrivals</li>
        <li>Price: Low to high</li>
        <li>Price: High to low</li>
      </ul>
      <ul className="md:hidden flex flex-wrap gap-2.5 text-sm leading-relaxed">
        <li>Relevance</li>
        <li>Latest arrivals</li>
        <li>Price: Low to high</li>
        <li>Price: High to low</li>
      </ul>

      <h1 className="text-amber-500">Not Implimented</h1>
    </div>
  );
}
