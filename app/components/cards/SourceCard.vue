<template>
  <OriginCard
    :origin="props.source.origin"
    :hide-desc="true"
    :hide-actions="true"
  >
    <div class="flex flex-col gap-4">
      <section>
        <p class="text-muted font-bold text-sm">
          {{ $t("components.Source.created") }}
        </p>
        <p>{{ createdAt }}</p>
      </section>
      <footer class="flex gap-2">
        <UButton class="cursor-not-allowed bg-gray-400 hover:bg-gray-400"
          ><UIcon name="lucide:info" />
          {{ $t("components.Source.actions.moreInfo") }}</UButton
        >
        <UButton
          class="bg-error hover:bg-error-500 cursor-pointer"
          @click="emits('unlink')"
          ><UIcon name="lucide:unlink" />
          {{ $t("components.Source.actions.delete") }}</UButton
        >
      </footer>
    </div>
  </OriginCard>
</template>

<script setup lang="ts">
import OriginCard from "./OriginCard.vue";

const i18n = useI18n();
const props = defineProps<{ source: SourceView }>();
const emits = defineEmits(["unlink"]);

const createdAt = computed(() => {
  const locale = i18n.locale;
  const creationDate = new Date(props.source.createdAt);
  return creationDate.toLocaleDateString(locale.value);
});
</script>
