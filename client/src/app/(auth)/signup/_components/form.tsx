"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/lib/actions/auth";
import { SignupFormState } from "@/lib/types/auth";
import { useActionState } from "react";

export function SignupForm() {
  const [state, formAction, isPending] = useActionState<
    SignupFormState,
    FormData
  >(signup, undefined);

  return (
    <form action={formAction}>
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            defaultValue={state?.data?.name}
          />

          {state?.errors?.name && (
            <p className="text-sm text-red-500">{state.errors.name}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="john@example.com"
            defaultValue={state?.data?.email}
          />

          {state?.errors?.email && (
            <p className="text-sm text-red-500">{state.errors.email}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" />

          {state?.errors?.password && (
            <div className="text-sm text-red-500">
              <p>Password must:</p>
              <ul>
                {state.errors.password.map((error) => (
                  <li key={error}>- {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <Label>Confirm Password</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" />

          {state?.errors?.confirmPassword && (
            <p className="text-sm text-red-500">
              {state.errors.confirmPassword}
            </p>
          )}
        </div>

        <Button
          disabled={isPending}
          type="submit"
          className="mt-2 w-full cursor-pointer disabled:cursor-not-allowed"
        >
          {isPending ? "Submitting..." : "Signup"}
        </Button>

        {state?.message && (
          <p className="text-sm bg-red-100 text-red-700 p-2 rounded-md">
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
