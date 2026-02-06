export type FetchError =
  | {
      /** `unknown` also returned during network errors. */
      reason: "server_syntax_parse" | "unknown" | "authorization";
      uiFeedbackHandled: true;
    }
  | {
      reason: "error_response";
      response: ErrorResponse;
      uiFeedbackHandled: boolean;
    };

export type FetchResult<R> =
  | {
      success: true;
      body: R;
    }
  | {
      success: false;
      error: FetchError;
    };

/** Also handles error presentation. */
export const useFetchHandlerStore = defineStore("fetchHandler", () => {
  const toast = useToast();
  const i18n = useI18n();
  const authStore = useAuthorizationStore();

  const handleRequest = async <Request extends Record<string, any>, Response>(
    route: string,
    method: "GET" | "POST" | "PATCH" | "DELETE",
    authRequired: boolean,
    body: Request,
  ): Promise<FetchResult<Response>> => {
    const headers: HeadersInit = {};

    let sentBody: string | undefined;
    if (body) {
      sentBody = JSON.stringify(body);
      headers["Content-Type"] = "application/json";
    }

    if (authRequired) {
      const authorization = await authStore.getAuthorization();
      if (!authorization)
        return {
          success: false,
          error: {
            reason: "authorization",
            uiFeedbackHandled: true,
          },
        };
      headers["Authorization"] = authorization;
    }

    try {
      const res = await fetch(route, {
        method,
        body: sentBody,
        headers,
      });

      let body: any;
      if (res.body && res.headers.get("Content-Type") === "application/json") {
        body = await res.json();
      }

      if (!res.ok) {
        if (res.status >= 400 && res.status <= 499)
          return {
            success: false,
            error: {
              reason: "error_response",
              uiFeedbackHandled: false,
              response: body,
            },
          };

        if (res.status >= 500) {
          toast.add({
            title: i18n.t("toasts.errors.server.title"),
            description: i18n.t("toasts.errors.server.description"),
            color: "error",
          });
          return {
            success: false,
            error: {
              reason: "error_response",
              uiFeedbackHandled: true,
              response: body,
            },
          };
        }
      }

      return { success: true, body };
    } catch (error) {
      if (error instanceof SyntaxError) {
        toast.add({
          title: i18n.t("toasts.errors.unknown.title"),
          description: i18n.t("toasts.errors.unknown.description"),
          color: "error",
        });
        return {
          success: false,
          error: { reason: "server_syntax_parse", uiFeedbackHandled: true },
        };
      } else {
        // Unknown error - probably network.
        toast.add({
          title: i18n.t("toasts.errors.network.title"),
          description: i18n.t("toasts.errors.network.description"),
          color: "error",
        });
        return {
          success: false,
          error: { reason: "unknown", uiFeedbackHandled: true },
        };
      }
    }
  };

  return { handleRequest };
});
