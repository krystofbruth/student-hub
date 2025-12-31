const LOCAL_STORAGE_REFRESH_TOKEN_KEY = "auth_refresh-token";

/** Warning - it takes a while until it makes the first refresh etc. */
export const useAuthorizationStore = defineStore("authorization", () => {
  const authorized = ref(true);
  const accessToken = ref("");
  const lastRefresh = ref(new Date());
  let accessTokenExpiration: Date | undefined = undefined;
  const router = useRouter();

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const refresh = async (): Promise<boolean> => {
    await sleep(1000);
    lastRefresh.value = new Date();

    const refreshToken = localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
    if (!refreshToken) {
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
      localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
      authorized.value = false;
      accessToken.value = "";
      return false;
    }
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
        res.tokens.refreshToken
      );
      accessToken.value = res.tokens.accessToken;
      accessTokenExpiration = new Date(res.accessTokenExpiration);
      authorized.value = true;

      return true;
    } catch (error) {
      //@ts-ignore
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
      console.log(refreshAttempt);

      if (!refreshAttempt) return navigateToLoginAndReturn();
    }

    return `Bearer ${accessToken.value}`;
  };

  const isAuthorized = async (): Promise<boolean> => {
    const authorization = await getAuthorization();
    if (!authorization) return false;
    return true;
  };

  return {
    login,
    getAuthorization,
    navigateToLoginAndReturn,
    isAuthorized,
  };
});
