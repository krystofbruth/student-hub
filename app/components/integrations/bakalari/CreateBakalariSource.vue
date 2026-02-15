<template>
  <div class="flex flex-col items-start w-full gap-4 relative">
    <p>{{ $t("integrations.bakalari.instructions") }}</p>
    <UButton color="info" class="cursor-pointer w-fit" @click="handleSubmit"
      ><UIcon name="lucide:link" />{{
        $t("integrations.bakalari.connectButton")
      }}</UButton
    >
  </div>
</template>

<script setup lang="ts">
const apiExceptionHandler = useApiExceptionErrorHandler();
const sourceStore = useSourceStore();
const props = defineProps<{ origin: OriginView; closeSuccess: () => void }>();

const handleSubmit = async () => {
  const res = await sourceStore.createSource(props.origin._id, undefined);
  if (!res.success) {
    apiExceptionHandler.handleException(res.error);
    return;
  }

  props.closeSuccess();
};
</script>
