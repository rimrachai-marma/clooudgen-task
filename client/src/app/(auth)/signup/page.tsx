import Link from "next/link";
import { SignupForm } from "./_components/form";
export default function Page() {
  return (
    <div className="flex flex-col p-4 w-full max-w-xl">
      <h1 className="text-center text-3xl font-bold">Create an account</h1>
      <div className="mt-6">
        <SignupForm />
      </div>
      <div className="mt-6 text-center text-sm">
        Already have an account?{" "}
        <Link className="underline" href="/login">
          Login
        </Link>
      </div>
    </div>
  );
}
