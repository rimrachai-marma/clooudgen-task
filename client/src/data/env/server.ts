import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    API_BASE_URL: z.string().min(1),
    TOKEN_COOKIE_NAME: z.string().min(1),
    TOKEN_EXPIRES_IN: z.string().min(1),
  },

  experimental__runtimeEnv: process.env,
});
