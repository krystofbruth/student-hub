import { defineStore } from "pinia";
import { ref } from "vue";

export const useEventStore = defineStore("event", () => {
  const authorizationStore = useAuthorizationStore();
  const events = ref<EventView[]>([]);
  const toast = useToast();
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
          title: "Synchronization failure",
          color: "warning",
          description:
            "Something went wrong during synchronization from yours sources - check the synchronization failure log.",
        });
    } catch (error) {
      console.error(error);
    }
  };

  syncEvents();

  return { events, syncEvents };
});
