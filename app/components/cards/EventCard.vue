<template>
  <Card class="cursor-pointer" @click="handleOpenEventDetail">
    <header class="flex justify-between">
      <p class="font-bold">{{ props.event.title[$i18n.locale] }}</p>
      <p class="text-gray-500">
        {{ $t(`components.Event.eventTypes.${event.type}`) }}
      </p>
    </header>

    <!-- Assignment code -->
    <div v-if="props.event.type === 'ASSIGNMENT'">
      <p>{{ $t("components.Event.assignment.dueIn") }} {{ timeLeft }}</p>

      <!-- <p>
        <a target="_blank" :href="event.uri">{{
          $t("components.Event.uriLabel")
        }}</a>
      </p> -->
    </div>

    <!-- Alternation code -->
    <div v-if="props.event.type === 'ALTERNATION'">
      <p>{{ props.event.dueAt.toLocaleDateString($i18n.locale) }}</p>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from "./Card.vue";
import type { Event } from "#imports";

import EventDetailModal from "../modals/EventDetailModal.vue";

const props = defineProps<{ event: Event }>();
const i18n = useI18n();
const overlay = useOverlay();
const eventDetailModal = overlay.create(EventDetailModal);

const timeDurationHandler = useTimeDurationHandler();

const handleOpenEventDetail = () => {
  // window.open(props.event.uri, "_blank")?.focus();
  eventDetailModal.open({ event: props.event });
};

const timeLeft = timeDurationHandler.getTimeLeftValue(props.event.dueAt);
</script>
