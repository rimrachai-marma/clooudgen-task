import Collections from "@/app/(consumer)/search/_components/collections";
import Sorting from "@/app/(consumer)/search/_components/sortting";
import { Suspense } from "react";
import ChildrenWrapper from "./_components/children-wrapper";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto flex max-w-(--breakpoint-2xl) flex-col gap-8 p-4 md:flex-row">
      <div className="order-first w-full flex-none md:max-w-[125px]">
        <Collections />
      </div>
      <div className="order-last min-h-screen w-full md:order-none">
        <Suspense fallback={null}>
          <ChildrenWrapper>{children}</ChildrenWrapper>
        </Suspense>
      </div>
      <div className="order-none flex-none md:order-last md:w-[125px]">
        <Sorting />
      </div>
    </div>
  );
}
