const LOCAL_STORAGE_REFRESH_TOKEN_KEY = "auth_refresh-token";
// 1 minute
const REFRESH_TIMEOUT_MS = 1000 * 60;

/** Warning - it takes a while until it makes the first refresh etc. */
export const useAuthorizationStore = defineStore("authorization", () => {
  const authorized = ref(true);
  const accessToken = ref("");
  const toast = useToast();
  const i18n = useI18n();
  let refreshPromise: Promise<boolean> | undefined = undefined;
  const lastRefresh = ref<Date | undefined>(undefined);
  let accessTokenExpiration: Date | undefined = undefined;
  const router = useRouter();

  // function sleep(ms: number) {
  //   return new Promise((resolve) => setTimeout(resolve, ms));
  // }

  const refreshInner = async (): Promise<boolean> => {
    lastRefresh.value = new Date();

    const refreshToken = localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      toast.add({
        title: i18n.t("toasts.auth.log-in-required.title"),
        description: i18n.t("toasts.auth.log-in-required.description"),
        color: "error",
      });
      authorized.value = false;
      accessToken.value = "";
      return false;
    }

    const refreshRequest: RefreshRequest = { refreshToken };
    try {
      const res = await $fetch("/api/session/refresh", {
        body: refreshRequest,
        method: "PATCH",
      });

      if (!res.success) throw res;

      localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY, res.refreshToken);
      authorized.value = true;
      accessToken.value = res.accessToken;
      return true;
    } catch (error) {
      // :< must be a more elegant way to handle this
      if (error && typeof (error as any).status === "number") {
        const status = parseInt((error as any).status);
        switch (status) {
          case 404:
            toast.add({
              title: i18n.t("toasts.auth.session-expired.title"),
              description: i18n.t("toasts.auth.session-expired.description"),
              color: "warning",
            });
            break;
          case 500:
          case 503:
          default:
            toast.add({
              title: i18n.t("toasts.errors.server.title"),
              description: i18n.t("toasts.errors.server.description"),
              color: "warning",
            });
        }
      } else {
        toast.add({
          title: i18n.t("toasts.errors.network.title"),
          description: i18n.t("toasts.errors.network.description"),
          color: "error",
        });
      }

      await logout();
      console.error(error);
      return false;
    }
  };

  const refresh = async (): Promise<boolean> => {
    if (
      lastRefresh.value &&
      lastRefresh.value.getTime() - Date.now() < REFRESH_TIMEOUT_MS
    )
      return true;

    if (typeof refreshPromise !== "undefined") {
      return refreshPromise;
    }

    refreshPromise = refreshInner();
    const result = await refreshPromise;
    refreshPromise = undefined;
    return result;
  };

  /** Throws if network, internal server error or similiar occurs. */
  const login = async (email: string, password: string): Promise<boolean> => {
    const loginRequest: LoginRequest = { email, password };

    try {
      const res = await $fetch("/api/session", {
        method: "POST",
        body: loginRequest,
      });
      if (!res.success) throw res;

      localStorage.setItem(
        LOCAL_STORAGE_REFRESH_TOKEN_KEY,
        res.tokens.refreshToken,
      );
      accessToken.value = res.tokens.accessToken;
      accessTokenExpiration = new Date(res.accessTokenExpiration);
      authorized.value = true;

      return true;
    } catch (error) {
      //@ts-expect-error Need to read whether the error is a response.
      if (error && error.status === 400) return false;
      else throw error;
    }
  };

  // Navigates the user to the login page with the parameter `returnTo`
  const navigateToLoginAndReturn = (): undefined => {
    if (router.currentRoute.value.path === "/login") return;
    router.replace(`/login?returnTo=${router.currentRoute.value.path}`);
  };

  // If unauthorized, navigates to login
  const getAuthorization = async (): Promise<string | undefined> => {
    if (!authorized.value) {
      return navigateToLoginAndReturn();
    }

    if (
      !accessTokenExpiration ||
      Date.now() >= accessTokenExpiration.getTime()
    ) {
      const refreshAttempt = await refresh();

      if (!refreshAttempt) return navigateToLoginAndReturn();
    }

    return `Bearer ${accessToken.value}`;
  };

  const isAuthorized = async (): Promise<boolean> => {
    const authorization = await getAuthorization();
    if (!authorization) return false;
    return true;
  };

  /** Navigates to login as well */
  const logout = async (): Promise<undefined> => {
    localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
    authorized.value = false;
    accessToken.value = "";
    router.push("/login");
    return;
  };

  const logoutUser = async (): Promise<undefined> => {
    toast.add({
      title: i18n.t("toasts.auth.log-out-success.title"),
      description: i18n.t("toasts.auth.log-out-success.description"),
      color: "success",
    });
    await logout();
    return;
  };

  return {
    login,
    logoutUser,
    getAuthorization,
    navigateToLoginAndReturn,
    isAuthorized,
    /** Primarily use `isAuthorized` method! */
    authorized,
  };
});
