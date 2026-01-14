<template>
  <article
    class="w-full rounded-md bg-accented p-3 box-border flex flex-col gap-2"
  >
    <header>
      <p class="font-bold text-lg">{{ $t("modules.AssignmentView.title") }}</p>
    </header>
    <div class="w-full box-border">
      <Event v-for="event in assignments" :key="event._id" :event="event" />
    </div>
  </article>
</template>

<script setup lang="ts">
import Event from "../events/Event.vue";
import { useEventStore } from "#imports";
const eventStore = useEventStore();

const assignments = computed(() => {
  const events = eventStore.events;

  return events.filter((e) => e.type === "ASSIGNMENT");
});

onMounted(async () => {
  eventStore.syncEvents();
});
</script>
