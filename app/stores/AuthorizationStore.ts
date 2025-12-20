const LOCAL_STORAGE_REFRESH_TOKEN_KEY = "auth_refresh-token";

export const useAuthorizationStore = defineStore("authorization", () => {
  const authorized = ref(false);
  const accessToken = ref("");
  const lastRefresh = ref(new Date());
  const router = useRouter();

  const refresh = async (): Promise<boolean> => {
    lastRefresh.value = new Date();

    const refreshToken = localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      authorized.value = false;
      accessToken.value = "";
      return false;
    }

    const refreshRequest: RefreshRequest = { refreshToken };
    const { data, status, error } = await useFetch("/api/session/refresh", {
      body: refreshRequest,
      method: "PATCH",
    });
    if (error || !data.value?.success) {
      localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
      authorized.value = false;
      accessToken.value = "";
      return false;
    }

    localStorage.setItem(
      LOCAL_STORAGE_REFRESH_TOKEN_KEY,
      data.value.refreshToken
    );
    authorized.value = true;
    accessToken.value = data.value.accessToken;
    return true;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const loginRequest: LoginRequest = { email, password };
    const { data, error } = await useFetch("/api/session", {
      method: "POST",
      body: loginRequest,
    });
    if (error || !data.value?.success) return false;

    localStorage.setItem(
      LOCAL_STORAGE_REFRESH_TOKEN_KEY,
      data.value.tokens.refreshToken
    );
    accessToken.value = data.value.tokens.accessToken;
    authorized.value = true;

    return true;
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
