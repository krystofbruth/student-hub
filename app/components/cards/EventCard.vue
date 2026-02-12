<template>
  <Card class="cursor-pointer" @click="handleOpenEventDetail">
    <header class="flex justify-between">
      <p class="font-bold">{{ event.title }}</p>
      <p class="text-gray-500">
        {{ $t(`components.Event.eventTypes.${event.type}`) }}
      </p>
    </header>

    <!-- Assignment code -->
    <div>
      <p v-if="event.type === 'ASSIGNMENT'">
        {{ $t("components.Event.assignment.dueIn") }} {{ event.timeLeft }}
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

interface EventInterface {
  timeLeft: string;
  title: string;
  type: EventType;
  uri: string;
}

const i18n = useI18n();

const handleOpenEventDetail = () => {
  // TODO: Dialog with details
  window.open(event.value.uri, "_blank")?.focus();
};

/** Shows years maximum. Very approximate, especially with months! */
const timeLeft = (target: Date, locale: string): string => {
  const deltaSeconds = (target.getTime() - Date.now()) / 1000;

  // const seconds = deltaSeconds % 60;
  const minutes = Math.floor(deltaSeconds / 60) % 60;
  const hours = Math.floor(deltaSeconds / 60 / 60) % 24;
  const days = Math.floor(deltaSeconds / 60 / 60 / 24) % 30;
  const months = Math.floor(deltaSeconds / 60 / 60 / 24 / 30) % 12;
  const years = Math.floor(deltaSeconds / 60 / 60 / 24 / 30 / 12);

  const intl = new Intl.DurationFormat(locale, { style: "long" });

  if (years > 0) return intl.format({ years, months });
  else if (months > 0) return intl.format({ months, days });
  else if (days > 7) return intl.format({ days });
  else if (days > 0) return intl.format({ days, hours });
  else if (hours > 0) return intl.format({ hours, minutes });
  else return intl.format({ minutes });
};

const props = defineProps<{
  event: Event;
}>();
const event = computed((): EventInterface => {
  const locale = i18n.locale.value;

  return {
    title: props.event.title,
    type: props.event.type as EventType,
    uri: props.event.uri,
    timeLeft: timeLeft(new Date(props.event.dueAt), locale),
  };
});
</script>
