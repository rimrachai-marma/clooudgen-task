"use server";

import { cookies } from "next/headers";
import { LoginFormSchema, SignupFormSchema } from "../schemas/auth";
import { redirect } from "next/navigation";
import { LoginFormState, SignupFormState, User } from "../types/auth";
import { env } from "@/data/env/server";

// Configuration
const API_BASE_URL = env.API_BASE_URL;
const TOKEN_COOKIE_NAME = env.TOKEN_COOKIE_NAME || "auth_token";
const TOKEN_EXPIRES_IN = parseInt(env.TOKEN_EXPIRES_IN || "2592000"); // 30 days

export async function signup(
  state: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      data: {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
      },
      message: "Validation failed",
    };
  }

  const { name, email, password, confirmPassword } = validatedFields.data;

  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        confirmPassword,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        message: responseData.message || "Internal server error",
        errors: responseData.errors || {},
        data: { name, email },
      };
    }

    const cookieStore = await cookies();
    cookieStore.set(TOKEN_COOKIE_NAME, responseData.data.access_token.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: TOKEN_EXPIRES_IN,
    });
  } catch (error) {
    console.log("Signup failed: ", error);

    return {
      message: "Internal server error",
      errors: {},
      data: { email: validatedFields.data.email },
    };
  }
}

export async function login(
  state: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed",
      errors: validatedFields.error.flatten().fieldErrors,
      data: { email: formData.get("email") as string },
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: validatedFields.data.email,
        password: validatedFields.data.password,
      }),
    });
    const responseData = await response.json();

    if (!response.ok) {
      return {
        message: responseData.message || "Internal server error",
        errors: responseData.errors || {},
        data: { email: validatedFields.data.email },
      };
    }

    const cookieStore = await cookies();
    cookieStore.set(TOKEN_COOKIE_NAME, responseData.data.access_token.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: TOKEN_EXPIRES_IN,
    });
  } catch (error) {
    console.log("Login failed: ", error);

    return {
      message: "Internal server error",
      errors: {},
      data: { email: validatedFields.data.email },
    };
  }
}

export async function logout() {
  const token = await getAuthToken();

  try {
    const response = await fetch(`${API_BASE_URL}/users/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      clearAuthCookie();
    }
  } catch (error) {
    console.error("Logout failed: ", error);
    return;
  }
  redirect("/login");
}

export async function validateUser(authToken: string): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      clearAuthCookie();
      return null;
    }

    const responseData = await response.json();

    return responseData?.data?.user || null;
  } catch (error) {
    console.error("Auth validation failed: ", error);
    clearAuthCookie();
    return null;
  }
}

// Get authentication token
export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE_NAME)?.value;
}

// Clear authentication cookie
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE_NAME);
}
