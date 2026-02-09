interface ProvidersCacheItem {
  fetchedAt: Date;
  item: ProviderView;
}

const CACHE_TIMEOUT_MS = 60 * 60 * 1000;

/** TODO: Customize so that it is smarter when querying and caching. */
export const useProviderStore = defineStore("provider", () => {
  const providersCache = ref<Map<string, ProvidersCacheItem>>(new Map());

  const getProvider = async (
    providerId: string,
  ): Promise<ProviderView | undefined> => {
    const cache = providersCache.value.get(providerId);
    if (cache && Date.now() - cache.fetchedAt.getTime() < CACHE_TIMEOUT_MS)
      return cache.item;

    providersCache.value.delete(providerId);

    // Really awful, do by query (not implemented yet ^_^)
    const providers = await $fetch("/api/provider", { method: "GET" });
    if (!providers.success) return undefined;

    setProviders(providers.data);

    const provider = providersCache.value.get(providerId);
    if (!provider) return undefined;
    return provider.item;
  };

  const setProviders = (providers: ProviderView[]) => {
    const fetchDate = new Date();
    for (const provider of providers) {
      providersCache.value.set(provider._id, {
        fetchedAt: fetchDate,
        item: provider,
      });
    }
  };

  return { getProvider, setProviders };
});
