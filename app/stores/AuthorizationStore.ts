const LOCAL_STORAGE_REFRESH_TOKEN_KEY = "auth_refresh-token";

/** Warning - it takes a while until it makes the first refresh etc. */
export const useAuthorizationStore = defineStore("authorization", () => {
  const authorized = ref(false);
  const accessToken = ref("");
  const lastRefresh = ref(new Date());
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
      authorized.value = true;

      return true;
    } catch (error) {
      //@ts-ignore
      if (error && error.status === 400) return false;
      else throw error;
    }
  };

  // Navigates the user to the login page with the parameter `returnTo`
  const navigateToLoginAndReturn = () => {
    router.replace(`/login?returnTo=${router.currentRoute}`);
  };

  // If unauthorized, navigates to login
  const getAuthorization = () => {
    if (!authorized.value) {
      navigateToLoginAndReturn();
      return "";
    }

    return `Bearer ${accessToken.value}`;
  };

  refresh().then(() => {
    if (
      !authorized.value &&
      router.currentRoute.value.fullPath.startsWith("/protected")
    )
      navigateToLoginAndReturn();
  });

  return {
    authorized,
    accessToken,
    login,
    refresh,
    getAuthorization,
    navigateToLoginAndReturn,
  };
});
