<template>
  <article>
    <p>{{ event.title }}</p>
    <p>Type: {{ event.type }}</p>
    <!-- Assignment code -->
    <p v-if="event.type === 'ASSIGNMENT'">Due in {{ event.timeLeft }}.</p>
    <p><a target="_blank" :href="event.uri">More info</a></p>
  </article>
</template>

<script setup lang="ts">
import type { EventType } from "~~/server/models/Event";

interface EventInterface {
  timeLeft: string;
  title: string;
  type: EventType;
  uri: string;
}

/** Shows years maximum. Very approximate, especially with months! */
const timeLeft = (target: Date): string => {
  const deltaSeconds = (target.getTime() - Date.now()) / 1000;

  // const seconds = deltaSeconds % 60;
  const minutes = Math.floor(deltaSeconds / 60) % 60;
  const hours = Math.floor(deltaSeconds / 60 / 60) % 24;
  const days = Math.floor(deltaSeconds / 60 / 60 / 24) % 30;
  const months = Math.floor(deltaSeconds / 60 / 60 / 24 / 30) % 12;
  const years = Math.floor(deltaSeconds / 60 / 60 / 24 / 30 / 12);

  if (years > 0) return `${years}yr ${months}mo`;
  else if (months > 0) return `${months}mo ${days}d`;
  else if (days > 7) return `${days}d`;
  else if (days > 0) return `${days}d ${hours}h`;
  else if (hours > 0) return `${hours}h ${minutes}m`;
  else return `${minutes}m`;
};

const props = defineProps<{
  event: EventView;
}>();
const event = computed((): EventInterface => {
  return {
    title: props.event.title,
    type: props.event.type as EventType,
    uri: props.event.type,
    timeLeft: timeLeft(new Date(props.event.dueAt)),
  };
});
</script>
