<template>
  <Card>
    <div class="flex flex-col items-center gap-2">
      <img
        class="w-20 h-20"
        :src="props.origin.logoUri"
        :alt="`${props.origin.name[locale]} logo`"
      />
      <div class="w-full flex flex-col gap-1">
        <p class="font-bold text-xl">{{ props.origin.name[locale] }}</p>
        <p v-if="!hideDesc">{{ props.origin.description[locale] }}</p>
        <section>
          <p class="text-muted font-bold text-sm">
            {{ $t("components.Source.provider") }}
          </p>
          <p v-if="props.origin.provider">{{ props.origin.provider.name }}</p>
          <p v-else>{{ $t("components.Source.universalProvider") }}</p>
        </section>
        <slot></slot>
      </div>
      <footer v-if="!hideActions" class="w-full">
        <UButton
          class="bg-info hover:bg-info-500 transition-all cursor-pointer"
          @click="emits('connect')"
          ><UIcon name="lucide:link" />
          {{ $t("components.Origin.actions.connect") }}</UButton
        >
      </footer>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from "./Card.vue";

const i18n = useI18n();
const locale = i18n.locale;
const emits = defineEmits(["connect"]);

const props = defineProps<{
  origin: OriginView;
  hideDesc?: boolean;
  hideActions?: boolean;
}>();
</script>
