<template>
  <UModal :title="$t('modals.eventDetail.title')" class="md:max-w-5xl">
    <template #body>
      <div class="w-full flex flex-col md:flex-row gap-4">
        <section class="grow flex flex-col gap-2 order-1">
          <CardProperty label-key="modals.eventDetail.eventTitle">
            <p class="font-bold text-lg">{{ event.title[$i18n.locale] }}</p>
          </CardProperty>

          <CardProperty label-key="modals.eventDetail.eventType">
            <p>
              {{ $t(`components.Event.eventTypes.${event.type}`) }}
            </p>
          </CardProperty>

          <CardProperty
            v-if="props.event.type === EventType.ASSIGNMENT"
            label-key="modals.eventDetail.dueDate"
          >
            <p>
              {{
                event.dueAt.toLocaleString($i18n.locale, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })
              }}
            </p>
          </CardProperty>

          <CardProperty v-else label-key="modals.eventDetail.date">
            <p>
              {{ event.dueAt.toLocaleDateString($i18n.locale) }}
            </p>
          </CardProperty>

          <CardProperty
            v-if="
              props.event.description &&
              props.event.description[$i18n.locale].length > 0
            "
            label-key="modals.eventDetail.description"
          >
            <p v-html="description"></p>
          </CardProperty>
        </section>
        <aside class="flex flex-col gap-4 grow-0 md:w-min order-0 md:order-2">
          <CardProperty label-key="modals.eventDetail.actions" class="gap-1">
            <a :href="props.event.uri" target="_blank" class="cursor-pointer"
              ><UButton color="info" class="cursor-pointer"
                ><UIcon name="lucide:arrow-up-right" />
                {{ $t("modals.eventDetail.link") }}</UButton
              ></a
            >
          </CardProperty>

          <CardProperty
            v-if="props.event.sourceId"
            label-key="modals.eventDetail.source"
            class="gap-1 hidden md:flex"
          >
            <SourceCard :source-id="props.event.sourceId" />
          </CardProperty>
        </aside>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { min } from "moment";
import type { Event } from "../../stores/EventStore";
import Card from "../cards/Card.vue";
import SourceCard from "../cards/SourceCard.vue";
import CardProperty from "../utilities/CardProperty.vue";
import showdown from "showdown";

const emits = defineEmits(["close"]);
const props = defineProps<{ event: Event }>();
const i18n = useI18n();

const description = computed(() => {
  const converter = new showdown.Converter();
  const locale = i18n.locale.value;

  if (!props.event.description) return "";
  else {
    const desc = props.event.description[locale].replaceAll(/\./g, "\\.");
    return converter.makeHtml(desc);
  }
});
</script>
