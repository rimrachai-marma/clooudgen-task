"use client";
import Link from "next/link";
import { LoginForm } from "./_components/form";

export default function Page() {
  return (
    <div className="flex flex-col p-4 w-full max-w-xl">
      <h1 className="text-center text-3xl font-bold">Login</h1>

      <div className="mt-6">
        <LoginForm />
      </div>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link className="underline" href="/signup">
          Sign up
        </Link>
      </div>
    </div>
  );
}
