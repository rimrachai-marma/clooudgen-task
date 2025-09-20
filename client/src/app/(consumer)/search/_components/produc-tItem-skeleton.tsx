import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const ProductItemSkeleton: React.FC = () => {
  return (
    <Card className="pt-0 pb-4 gap-3 overflow-hidden rounded-sm">
      <CardHeader className="relative aspect-video">
        <Skeleton className="absolute inset-0 rounded-none" />
      </CardHeader>

      <CardContent className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-5 w-1/3" />
      </CardContent>
    </Card>
  );
};

export default ProductItemSkeleton;
