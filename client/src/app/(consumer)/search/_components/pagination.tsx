"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter, useSearchParams } from "next/navigation";

interface Props {
  page: number;
  pages: number;
}

const Pagination: React.FC<Props> = ({ page = 8, pages = 35 }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { category } = useParams();

  const keyword = searchParams.get("keyword") as string | undefined;
  const query: Record<string, string> = {};
  if (keyword) {
    query.keyword = keyword;
  }

  const pageNumbers = [];

  for (let i = page - 3; i <= page + 3; i++) {
    if (i < 1) continue;
    if (i > pages) break;

    pageNumbers.push(i);
  }

  let actionRoute = "/search";
  if (category) {
    actionRoute += "/" + category;
  }

  const handlePageChange = (page: number) => {
    if (page !== 1) {
      query.page = page.toString();
    }

    const queryString = new URLSearchParams(query).toString();

    actionRoute += "?" + queryString;

    router.push(actionRoute);
  };

  return (
    pages > 1 && (
      <div className="flex items-center justify-center gap-2 my-8">
        {/* Previous Button */}
        <Button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          variant="outline"
          size="sm"
          className="cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>

        {/* Page Number Buttons */}
        {pageNumbers.map((pageNumber) => (
          <Button
            onClick={() => handlePageChange(pageNumber)}
            key={pageNumber}
            disabled={page === pageNumber}
            variant={page === pageNumber ? "secondary" : "outline"}
            size="sm"
            className="cursor-pointer"
          >
            {pageNumber}
          </Button>
        ))}

        {/* Next Button */}
        <Button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === pages}
          variant="outline"
          size="sm"
          className="cursor-pointer"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    )
  );
};

export default Pagination;
