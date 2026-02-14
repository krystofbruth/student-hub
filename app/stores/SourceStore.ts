import type { Result } from "~/types/Result";

export const useSourceStore = defineStore("source", () => {
  // TODO: Use a transformated object with types such as `Date`
  const sources = ref<SourceView[]>([]);

  const fetchSources = async (): Promise<Result<undefined>> => {
    const res = await request<undefined, ListSourcesResponse>("/api/source", {
      method: "GET",
      body: undefined,
      authRequired: true,
    });

    if (!res.success) return res;

    sources.value = res.data.data;
    return { success: true, data: undefined };
  };

  //   const deleteSource = async (): Promise<Result<undefined>> => {
  //   };

  return { sources, fetchSources };
});
