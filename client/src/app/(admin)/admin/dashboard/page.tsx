import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminDashborad() {
  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="font-bold text-5xl mt-12">Admin Dashboard</h1>
      <Link href="/admin/products/create">
        <Button className="cursor-pointer">Add Product</Button>
      </Link>
    </div>
  );
}
