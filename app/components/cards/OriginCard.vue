<template>
  <Card>
    <div class="flex flex-col items-center gap-4 p-2 box-border h-full">
      <img
        class="w-18 h-18"
        :src="props.origin.logoUri"
        :alt="`${props.origin.name[locale]} logo`"
      />
      <div class="w-full flex flex-col gap-4 grow">
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
        <SourceCreationModal :origin="origin" @connected="emits('connected')" />
      </footer>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from "./Card.vue";
import SourceCreationModal from "../modals/SourceCreationModal.vue";

const i18n = useI18n();
const locale = i18n.locale;
const emits = defineEmits(["connect", "connected"]);

const props = defineProps<{
  origin: OriginView;
  hideDesc?: boolean;
  hideActions?: boolean;
}>();
</script>
