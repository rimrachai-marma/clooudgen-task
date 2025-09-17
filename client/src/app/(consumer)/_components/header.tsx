import Link from "next/link";
import React, { Suspense } from "react";
import Search from "./search";
import { Button } from "@/components/ui/button";
import { getProfile } from "@/lib/actions/users";
import Form from "next/form";
import { logout } from "@/lib/actions/auth";

export default async function Header() {
  const user = await getProfile();

  return (
    <header className="border-b border-gray-200 p-4">
      <div className="flex gap-4 justify-between items-center flex-wrap md:flex-nowrap">
        <Link href="/">
          <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
        </Link>

        <div className="w-full order-1 md:order-none md:max-w-sm">
          <Search />
        </div>

        <div className="flex items-center space-x-3.5">
          <Suspense fallback={null}>
            {user && (
              <>
                <Link href="/profile" className="border-r-2">
                  <Button variant="link" className="cursor-pointer">
                    {user?.name}
                  </Button>
                </Link>
                <Form action={logout}>
                  <Button variant="destructive" className="cursor-pointer">
                    Logout
                  </Button>
                </Form>
              </>
            )}

            {!user && (
              <Link href="/login">
                <Button variant="outline" className="cursor-pointer">
                  Login
                </Button>
              </Link>
            )}
          </Suspense>
        </div>
      </div>
    </header>
  );
}
