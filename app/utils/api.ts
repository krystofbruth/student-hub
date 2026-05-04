import { ApiException, AuthReason } from "../types/Exceptions";
import type { Result } from "~/types/Result";

const LOCAL_STORAGE_REFRESH_TOKEN_KEY = "auth_refresh-token";

let refreshPromise: Promise<boolean> | undefined = undefined;
let accessToken: string | undefined = undefined;
let accessTokenExpiration: Date | undefined = undefined;

const refresh = async (): Promise<boolean> => {
  const refreshToken = localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    removeCredentials();
    return false;
  }

  const refreshRequest: RefreshRequest = { refreshToken };

  const res = await request<RefreshRequest, RefreshResponse>(
    "/api/session/refresh",
    {
      body: refreshRequest,
      method: "PATCH",
    },
  );
  if (
    !res.success &&
    res.error instanceof ApiException &&
    res.error.details.response &&
    res.error.details.response.status === 404
  ) {
    // TODO: Check for token interception by evaluating refreshTokenExpiration - simpler for now.
    removeCredentials();
    return false;
  } else if (!res.success) throw res;
  // Unhandled fetch error intentional - breaks out of everything to prevent redirection and other session expiry related logic.

  saveCredentials(
    res.data.accessToken,
    new Date(res.data.accessTokenExpiration),
    res.data.refreshToken,
  );
  return true;
};

/** Throws if network, internal server error or similiar occurs. */
export const saveCredentials = async (
  accessTokenInput: string,
  accessTokenExpirationInput: Date,
  refreshToken: string,
) => {
  accessToken = accessTokenInput;
  accessTokenExpiration = new Date(accessTokenExpirationInput);
  localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY, refreshToken);
};

/** Returns an access token to be used with scheme `Bearer` */
const getAccessToken = async (): Promise<
  { success: true; token: string } | { success: false; reason: AuthReason }
> => {
  if (refreshPromise) await refreshPromise;

  if (!accessToken || !accessTokenExpiration)
    return { success: false, reason: AuthReason.AUTH_MISSING };

  if (accessTokenExpiration.getTime() <= Date.now()) {
    if (!refreshPromise) refreshPromise = refresh();
    const refreshResult = await refreshPromise;

    refreshPromise = undefined;
    if (!refreshResult)
      return {
        success: false,
        reason: AuthReason.AUTH_INVALID,
      };
  }

  return { success: true, token: accessToken };
};

/** Navigates to login as well */
export const removeCredentials = () => {
  localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
  accessToken = undefined;
};

export const isAuthorized = async (): Promise<
  { success: true } | { success: false; reason: AuthReason }
> => {
  const authToken = await getAccessToken();
  if (!authToken.success) return { success: false, reason: authToken.reason };
  return { success: true };
};

export const request = async <
  Request extends Record<string, any> | undefined,
  Response,
>(
  route: string,
  options: {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body: Request;
    authRequired?: boolean;
  },
): Promise<Result<Response>> => {
  const headers: HeadersInit = {};

  let sentBody: string | undefined;
  if (typeof options.body !== "undefined") {
    sentBody = JSON.stringify(options.body);
    headers["Content-Type"] = "application/json";
  }

  if (options.authRequired === true) {
    const authorization = await getAccessToken();
    if (!authorization.success)
      return {
        success: false,
        error: new ApiException("authorization", route, {
          authReason: authorization.reason,
        }),
      };
    headers["Authorization"] = `Bearer ${authorization.token}`;
  }

  try {
    const res = await fetch(route, {
      method: options.method,
      body: sentBody,
      headers,
    });

    let body: any;
    if (res.body && res.headers.get("Content-Type") === "application/json") {
      body = await res.json();
    }

    if (!res.ok) {
      if (res.status === 401 && options.authRequired === true) {
        removeCredentials();
        console.error("SESSION INTERCEPTION!");
        return {
          success: false,
          error: new ApiException("authorization", route, {
            authReason: AuthReason.AUTH_INTERCEPTED,
          }),
        };
      } else
        return {
          success: false,
          error: new ApiException("error_response", route, { response: body }),
        };
    }

    return { success: true, data: body };
  } catch (error) {
    return { success: false, error: new ApiException("unknown", route, {}) };
  }
};

refreshPromise = refresh();
