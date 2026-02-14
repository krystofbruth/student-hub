<template>
  <Card class="cursor-pointer" @click="handleOpenEventDetail">
    <header class="flex justify-between">
      <p class="font-bold">{{ props.event.title }}</p>
      <p class="text-gray-500">
        {{ $t(`components.Event.eventTypes.${event.type}`) }}
      </p>
    </header>

    <!-- Assignment code -->
    <div>
      <p v-if="props.event.type === 'ASSIGNMENT'">
        {{ $t("components.Event.assignment.dueIn") }} {{ timeLeft }}
      </p>

      <!-- <p>
        <a target="_blank" :href="event.uri">{{
          $t("components.Event.uriLabel")
        }}</a>
      </p> -->
    </div>
  </Card>
</template>

<script setup lang="ts">
import { EventType } from "#imports";
import Card from "./Card.vue";
import type { Event } from "#imports";

const props = defineProps<{ event: Event }>();

const timeDurationHandler = useTimeDurationHandler();

const handleOpenEventDetail = () => {
  // TODO: Dialog with details
  window.open(props.event.uri, "_blank")?.focus();
};

const timeLeft = timeDurationHandler.getTimeLeftValue(props.event.dueAt);
</script>
