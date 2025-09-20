import Link from "next/link";
import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { getProfile } from "@/lib/actions/users";
import Form from "next/form";
import { logout } from "@/lib/actions/auth";

export default async function Header() {
  const userData = await getProfile();

  return (
    <header className="border-b border-gray-200 p-4">
      <div className="flex gap-4 justify-between items-center">
        <div className="flex gap-3 items-center">
          <Link href="/">
            <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
          </Link>
          <span className="text-2xl font-semibold">Dashboard</span>
        </div>

        <div className="flex items-center space-x-3.5">
          <Suspense fallback={null}>
            {userData?.user && (
              <>
                <Link href="/profile" className="border-r-2">
                  <Button variant="link" className="cursor-pointer">
                    {userData?.user.name}
                  </Button>
                </Link>
                <Form action={logout}>
                  <Button variant="destructive" className="cursor-pointer">
                    Logout
                  </Button>
                </Form>
              </>
            )}

            {!userData?.user && (
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
