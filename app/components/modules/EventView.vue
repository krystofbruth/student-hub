<template>
  <article
    class="w-full rounded-md bg-accented p-3 box-border flex flex-col gap-2"
  >
    <header class="flex justify-between items-start">
      <p v-if="props.filter === EventType.ASSIGNMENT" class="font-bold text-lg">
        {{ $t("modules.AssignmentView.title") }}
      </p>
      <p
        v-else-if="props.filter === EventType.ALTERNATION"
        class="font-bold text-lg"
      >
        {{ $t("modules.AlternationView.title") }}
      </p>
      <p v-else="!props.filter" class="font-bold text-lg">
        {{ $t("modules.EventView.title") }}
      </p>

      <p
        class="text-muted text-sm cursor-pointer flex items-center gap-0.5 hover:text-inherit transition"
        @click="forceSyncEvents"
      >
        <UIcon name="lucide:refresh-cw" />
        {{ $t("modules.EventView.refresh") }}
      </p>
    </header>
    <div class="w-full box-border flex flex-col gap-2">
      <EventCard v-for="event in events" :key="event._id" :event="event" />
    </div>
  </article>
</template>

<script setup lang="ts">
import EventCard from "../cards/EventCard.vue";
import { EventType, useEventStore } from "#imports";
const eventStore = useEventStore();
const apiExceptionHandler = useApiExceptionErrorHandler();
let interval: number | undefined;

const props = defineProps<{ filter?: EventType }>();
const toast = useToast();
const i18n = useI18n();

const SYNC_FREQUENCY_MS = 60 * 1000;

const events = computed(() => {
  const sourceEvents = eventStore.events;
  if (!props.filter) return sourceEvents;
  else return sourceEvents.filter((e) => e.type === props.filter);
});

const forceSyncEvents = async () => {
  const res = await syncEvents();
  if (res.success)
    toast.add({
      title: i18n.t("toasts.events.sync-success.title"),
      description: i18n.t("toasts.events.sync-success.description"),
      color: "success",
    });
};

const syncEvents = async () => {
  const res = await eventStore.syncEvents();

  if (!res.success) apiExceptionHandler.handleException(res.error);
  return res;
};

onMounted(async () => {
  await syncEvents();

  interval = setInterval(
    () => syncEvents(),
    SYNC_FREQUENCY_MS,
  ) as unknown as number;
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>
