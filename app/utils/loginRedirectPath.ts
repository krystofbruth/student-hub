import type { AuthReason } from "~/types/Exceptions";

export const getRedirectToLoginPath = (reason: AuthReason) => {
  const currentPath = window.location.pathname;
  return `/login?returnTo=${currentPath}&reason=${reason}`;
};

export const getRedirectFromLoginPath = (): string => {
  const returnToPath = new URLSearchParams(window.location.search).get(
    "returnTo",
  );
  return returnToPath || "/dashboard";
};
