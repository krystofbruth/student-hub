<template>
  <UModal :title="$t('modals.sourceDeletion.title')" v-model:open="open">
    <UButton class="cursor-pointer" color="error"
      ><UIcon name="lucide:unlink" />
      {{ $t("components.Source.actions.delete") }}</UButton
    >

    <template #body>
      <div class="flex flex-col gap-4">
        <p>
          {{ $t("modals.sourceDeletion.areYouSure") }}
          <span class="font-bold">{{ props.sourceTitle[$i18n.locale] }}</span
          >?
        </p>

        <section class="flex gap-3">
          <UButton
            class="flex items-center gap-1 cursor-pointer"
            color="error"
            @click="handleSelection(true)"
            ><UIcon name="lucide:trash-2" />
            {{ $t("modals.sourceDeletion.deleteButton") }}</UButton
          >

          <UButton
            class="flex items-center gap-1 cursor-pointer"
            color="neutral"
            @click="handleSelection(false)"
            ><UIcon name="lucide:x" />
            {{ $t("modals.sourceDeletion.cancelButton") }}</UButton
          >
        </section>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const open = ref(false);
const { locale } = useI18n();

const props = defineProps<{
  sourceTitle: Record<typeof locale.value, string>;
  callback: (c: boolean) => void;
}>();

const handleSelection = (confirmed: boolean) => {
  open.value = false;
  props.callback(confirmed);
};
</script>
