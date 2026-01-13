<template>
  <article>
    <p>{{ event.title }}</p>
    <p>
      {{ $t("components.Event.type") }}
      {{ $t(`components.Event.eventTypes.${event.type}`) }}
    </p>

    <!-- Assignment code -->
    <p v-if="event.type === 'ASSIGNMENT'">
      {{ $t("components.Event.assignment.dueIn") }} {{ event.timeLeft }}
    </p>

    <p>
      <a target="_blank" :href="event.uri">{{
        $t("components.Event.uriLabel")
      }}</a>
    </p>
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

const i18n = useI18n();

/** Shows years maximum. Very approximate, especially with months! */
const timeLeft = (target: Date, locale: string): string => {
  const deltaSeconds = (target.getTime() - Date.now()) / 1000;

  // const seconds = deltaSeconds % 60;
  const minutes = Math.floor(deltaSeconds / 60) % 60;
  const hours = Math.floor(deltaSeconds / 60 / 60) % 24;
  const days = Math.floor(deltaSeconds / 60 / 60 / 24) % 30;
  const months = Math.floor(deltaSeconds / 60 / 60 / 24 / 30) % 12;
  const years = Math.floor(deltaSeconds / 60 / 60 / 24 / 30 / 12);

  // @ts-expect-error Intl.DurationFormat not part of TS definitions even though baseline.
  const intl = new Intl.DurationFormat(locale, { style: "short" });

  if (years > 0) return intl.format({ years, months });
  else if (months > 0) return intl.format({ months, days });
  else if (days > 7) return intl.fomrat({ days });
  else if (days > 0) return intl.format({ days, hours });
  else if (hours > 0) return intl.format({ hours, minutes });
  else return intl.format({ minutes });
};

const props = defineProps<{
  event: EventView;
}>();
const event = computed((): EventInterface => {
  const locale = i18n.locale.value;

  return {
    title: props.event.title,
    type: props.event.type as EventType,
    uri: props.event.type,
    timeLeft: timeLeft(new Date(props.event.dueAt), locale),
  };
});
</script>
