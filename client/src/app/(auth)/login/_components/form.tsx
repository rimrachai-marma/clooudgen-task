import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/actions/auth";
import { useActionState } from "react";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, {
    data: {
      email: "john@example.com",
      password: "12345678",
    },
  });

  return (
    <form action={formAction}>
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="m@example.com"
            type="email"
            defaultValue={state?.data?.email}
          />
          {state?.errors?.email && (
            <p className="text-sm text-red-500">{state.errors.email}</p>
          )}
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            id="password"
            type="password"
            name="password"
            defaultValue={state?.data?.password}
          />
          {state?.errors?.password && (
            <p className="text-sm text-red-500">{state.errors.password}</p>
          )}
        </div>

        <Button
          disabled={isPending}
          type="submit"
          className="mt-2 w-full cursor-pointer"
        >
          {isPending ? "Submitting..." : "Login"}
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
