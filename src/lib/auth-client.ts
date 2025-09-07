import type { ClientOptions } from "better-auth";
import {
  customSessionClient,
  inferAdditionalFields,
  jwtClient,
  twoFactorClient,
  magicLinkClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  plugins: [
    customSessionClient(),
    jwtClient(),
    twoFactorClient(),
    magicLinkClient(),
    inferAdditionalFields({
      user: {
        firstName: {
          type: "string",
          required: false,
        },
        lastName: {
          type: "string",
          required: false,
        },
        phone: {
          type: "string",
          required: false,
        },
        avatar: {
          type: "string",
          required: false,
        },
        role: {
          type: "string",
          required: false,
          defaultValue: "CUSTOMER",
        },
        isActive: {
          type: "boolean",
          required: false,
          defaultValue: true,
        },
      },
    }),
  ],
  fetchOptions: {
    credentials: "include",
    onError: (ctx) => {
      console.error("Auth client error:", ctx.error.message, ctx.error.cause);
    },
  },
} satisfies ClientOptions);
