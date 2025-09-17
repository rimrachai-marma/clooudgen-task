"use client";

import { Input } from "@/components/ui/input";
import Form from "next/form";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function Search() {
  const router = useRouter();
  const { category } = useParams();
  const searchParams = useSearchParams();

  const query: Record<string, string> = {};

  let actionRoute = "/search";
  if (category) {
    actionRoute += "/" + category;
  }

  const search = (formData: FormData) => {
    const keyword = formData.get("keyword") as string;

    if (keyword) {
      query.keyword = keyword;
    }
    const queryString = new URLSearchParams(query).toString();

    actionRoute += "?" + queryString;

    router.push(actionRoute);
  };

  return (
    <Form action={search}>
      <Input
        key={searchParams?.get("keyword")}
        type="search"
        name="keyword"
        placeholder="Search for products..."
        autoComplete="off"
        defaultValue={searchParams?.get("keyword") || ""}
      />
    </Form>
  );
}
