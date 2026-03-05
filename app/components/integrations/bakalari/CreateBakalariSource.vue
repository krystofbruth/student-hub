<template>
  <div class="flex flex-col items-start w-full gap-4 relative">
    <p>{{ $t("integrations.bakalari.instructions") }}</p>
    <XButton
      title-key="integrations.bakalari.connectButton"
      icon-key="lucide:link"
      color="info"
      class="w-fit"
      :is-loading="creationStateHandler.isLoading.value"
      @click="creationStateHandler.handle"
      icon-position="before"
    />
  </div>
</template>

<script setup lang="ts">
import XButton from "~/components/utilities/XButton.vue";

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

const creationStateHandler = useStateHandler(handleSubmit);
</script>
