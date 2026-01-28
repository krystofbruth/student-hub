import { defineStore } from "pinia";
import { ref } from "vue";

export const useEventStore = defineStore("event", () => {
  const authorizationStore = useAuthorizationStore();
  const events = ref<EventView[]>([]);
  const toast = useToast();
  const i18n = useI18n();
  let lastSync: Date;

  setInterval(async () => {
    await syncEvents();
  }, 60000);

  const syncEvents = async () => {
    // If syncs request within a timeframe of 10 seconds.
    if (lastSync && Date.now() - lastSync.getTime() < 10000) return;
    lastSync = new Date();

    if (!(await authorizationStore.isAuthorized())) {
      events.value = [];
      return;
    }

    try {
      const authorization = await authorizationStore.getAuthorization();
      if (!authorization) return;
      const res = await $fetch("/api/event", {
        headers: { Authorization: authorization },
      });
      if (!res.success) throw res;

      events.value = res.events;

      if (res.code === "SYNC_FAILURE")
        toast.add({
          title: i18n.t("toasts.events.sync-failure.title"),
          description: i18n.t("toasts.events.sync-failure.description"),
          color: "warning",
        });
    } catch (error) {
      console.error(error);
    }
  };

  syncEvents();

  return { events, syncEvents };
});
