<template>
  <article class="AssignmentView">
    <header>
      <p class="font-bold">{{ $t("modules.AssignmentView.title") }}</p>
    </header>
    <div class="events">
      <Event
        v-for="event in eventStore.events"
        :key="event._id"
        :event="event"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
import Event from "../events/Event.vue";
import { useEventStore } from "#imports";
const eventStore = useEventStore();

onMounted(async () => {
  eventStore.syncEvents();
});
</script>
