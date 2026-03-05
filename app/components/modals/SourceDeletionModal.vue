<template>
  <UModal
    :title="$t('modals.sourceDeletion.title')"
    v-model:open="open"
    :dismissible="!deletionStateHandler.isLoading.value"
    :close="!deletionStateHandler.isLoading.value"
  >
    <UButton class="cursor-pointer" color="error"
      ><UIcon name="lucide:unlink" />
      {{ $t("components.Source.actions.delete") }}</UButton
    >

    <template #body>
      <div class="flex flex-col gap-4">
        <p>
          {{ $t("modals.sourceDeletion.areYouSure") }}
          <span class="font-bold">{{
            props.source.origin.name[$i18n.locale]
          }}</span
          >?
        </p>

        <section class="flex gap-3">
          <XButton
            color="error"
            title-key="modals.sourceDeletion.deleteButton"
            icon-key="lucide:trash-2"
            icon-position="before"
            :is-loading="deletionStateHandler.isLoading.value"
            @click="deletionStateHandler.handle"
          />

          <UButton
            class="flex items-center gap-1 cursor-pointer"
            color="neutral"
            @click="open = false"
            ><UIcon name="lucide:x" />
            {{ $t("modals.sourceDeletion.cancelButton") }}</UButton
          >
        </section>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import XButton from "../utilities/XButton.vue";

const open = ref(false);
const toast = useToast();
const sourceStore = useSourceStore();
const apiExceptionHandler = useApiExceptionErrorHandler();
const overlay = useOverlay();

const props = defineProps<{
  source: SourceView;
}>();

const handleSourceDeletion = async () => {
  const res = await sourceStore.deleteSource(props.source._id);
  if (!res.success) apiExceptionHandler.handleException(res.error);
  else {
    toast.add({
      color: "success",
      title: $t("toasts.sources.deletionSuccess.title"),
      description: $t("toasts.sources.deletionSuccess.description"),
    });
    overlay.closeAll();
    open.value = false;
    sourceStore.fetchSources();
  }
};

const deletionStateHandler = useStateHandler(handleSourceDeletion);
</script>
