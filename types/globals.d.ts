import type { AuthClient } from "better-auth/react";

declare global {
  interface Window {
    authClient: AuthClient;
  }
}
