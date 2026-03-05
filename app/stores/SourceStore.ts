import type { Result } from "~/types/Result";
import type { CreateSourceResponse } from "~~/shared/types/CreateSourceResponse";

const SYNC_LIMIT_MS = 15 * 1000;

export const useSourceStore = defineStore("source", () => {
  // TODO: Use a transformated object with types such as `Date`
  const sources = ref<SourceView[]>([]);
  let lastSync: Date | undefined;

  const fetchSources = async (): Promise<Result<undefined>> => {
    if (lastSync && Date.now() - lastSync.getTime() < SYNC_LIMIT_MS)
      return { success: true, data: undefined };
    lastSync = new Date();

    const res = await request<undefined, ListSourcesResponse>("/api/source", {
      method: "GET",
      body: undefined,
      authRequired: true,
    });

    if (!res.success) return res;

    sources.value = res.data.data;
    return { success: true, data: undefined };
  };

  const deleteSource = async (sourceId: string): Promise<Result<undefined>> => {
    const res = await request<undefined, undefined>(`/api/source/${sourceId}`, {
      method: "DELETE",
      body: undefined,
      authRequired: true,
    });
    if (!res.success) return res;

    return await fetchSources();
  };

  const createSource = async (
    originId: string,
    credentials: any,
  ): Promise<Result<undefined>> => {
    const res = await request<CreateSourceRequest, CreateSourceResponse>(
      "/api/source",
      { method: "POST", body: { originId, credentials }, authRequired: true },
    );

    if (!res.success) return res;

    return fetchSources();
  };

  return { sources, fetchSources, deleteSource, createSource };
});
