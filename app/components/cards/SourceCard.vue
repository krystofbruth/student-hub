<template>
  <OriginCard
    :origin="props.source.origin"
    :hide-desc="true"
    :hide-actions="true"
  >
    <div class="flex flex-col gap-4 h-full">
      <section class="grow">
        <p class="text-muted font-bold text-sm">
          {{ $t("components.Source.created") }}
        </p>
        <p>{{ createdAt }}</p>
      </section>
      <footer class="flex gap-2 flex-wrap">
        <UButton color="neutral" class="cursor-not-allowed"
          ><UIcon name="lucide:info" />
          {{ $t("components.Source.actions.moreInfo") }}</UButton
        >
        <SourceDeletionModal
          :source-title="props.source.origin.name"
          :callback="handleSourceDeletion"
        />
      </footer>
    </div>
  </OriginCard>
</template>

<script setup lang="ts">
import SourceDeletionModal from "../modals/SourceDeletionModal.vue";
import OriginCard from "./OriginCard.vue";

const i18n = useI18n();
const toast = useToast();
const sourceStore = useSourceStore();
const props = defineProps<{ source: SourceView }>();
const apiExceptionHandler = useApiExceptionErrorHandler();
const emits = defineEmits(["unlink"]);

const createdAt = computed(() => {
  const locale = i18n.locale;
  const creationDate = new Date(props.source.createdAt);
  return creationDate.toLocaleDateString(locale.value);
});

const handleSourceDeletion = async (confirmed: boolean) => {
  if (!confirmed) return;

  const res = await sourceStore.deleteSource(props.source._id);
  if (!res.success) apiExceptionHandler.handleException(res.error);
  else
    toast.add({
      color: "success",
      title: $t("toasts.sources.deletionSuccess.title"),
      description: $t("toasts.sources.deletionSuccess.description"),
    });
};
</script>
