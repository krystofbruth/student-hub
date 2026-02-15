import type { Result } from "~/types/Result";

export const useOriginStore = defineStore("origin", () => {
  // TODO: Use a transformated object with types such as `Date`
  const origins = ref<OriginView[]>([]);

  const fetchOrigins = async (): Promise<Result<undefined>> => {
    const res = await request<undefined, FetchOriginsResponse>("/api/origin", {
      method: "GET",
      body: undefined,
      authRequired: false,
    });

    if (!res.success) return res;

    origins.value = res.data.data;
    return { success: true, data: undefined };
  };

  return { origins, fetchOrigins };
});
