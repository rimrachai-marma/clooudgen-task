import { env } from "@/data/env/server";
import { User } from "../types/auth";
import { getAuthToken } from "./auth";

// Configuration
const API_BASE_URL = env.API_BASE_URL;

export async function getProfile(): Promise<User | null> {
  const token = await getAuthToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const responseData = await response.json();

    return responseData?.data?.user || null;
  } catch (error) {
    console.log("User profile fetch error: ", error);

    return null;
  }
}
