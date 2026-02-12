<template>
  <article
    class="w-full rounded-md bg-accented p-3 box-border flex flex-col gap-2"
  >
    <header>
      <p class="font-bold text-lg">{{ $t("modules.AssignmentView.title") }}</p>
    </header>
    <div class="w-full box-border flex flex-col gap-2">
      <EventCard
        v-for="event in eventStore.events.ASSIGNMENT.values"
        :key="event._id"
        :event="event"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
import EventCard from "../cards/EventCard.vue";
import { EventType, useEventStore } from "#imports";
const eventStore = useEventStore();
const apiExceptionHandler = useApiExceptionErrorHandler();
let interval: number | undefined;

const SYNC_FREQUENCY_MS = 60 * 1000;

const syncAssignments = async () => {
  const res = await eventStore.syncEvents(EventType.ASSIGNMENT);

  if (!res.success) apiExceptionHandler.handleException(res.error);
};

onMounted(async () => {
  await syncAssignments();

  interval = setInterval(
    () => syncAssignments(),
    SYNC_FREQUENCY_MS,
  ) as unknown as number;
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>
