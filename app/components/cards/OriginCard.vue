<template>
  <Card>
    <div
      v-if="origin"
      class="flex flex-col items-center gap-4 p-2 box-border h-full"
    >
      <img
        class="w-18 h-18 object-contain"
        :src="
          darkModeStore.darkMode && origin.logoUriDark
            ? origin.logoUriDark
            : origin.logoUri
        "
        :alt="`${origin.name[$i18n.locale]} logo`"
      />
      <div class="w-full flex flex-col gap-4 grow">
        <p class="font-bold text-xl">{{ origin.name[$i18n.locale] }}</p>
        <p>{{ origin.description[$i18n.locale] }}</p>
        <section>
          <CardProperty label-key="components.Source.provider">
            <p v-if="origin.provider">{{ origin.provider.name }}</p>
            <p v-else>{{ $t("components.Source.universalProvider") }}</p>
          </CardProperty>
        </section>
        <slot></slot>
      </div>
      <footer class="w-full">
        <SourceCreationModal :origin="origin" />
      </footer>
    </div>
    <div v-else class="flex flex-col items-center gap-4 p-2 box-border h-full">
      <UIcon name="lucide:file-exclamation-point" class="size-18 text-muted" />
      <p class="text-muted font-bold select-none">
        {{ $t("components.Source.loadFailure") }}
      </p>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from "./Card.vue";
import SourceCreationModal from "../modals/SourceCreationModal.vue";
import CardProperty from "../utilities/CardProperty.vue";

const originStore = useOriginStore();
const apiExceptionHandler = useApiExceptionErrorHandler();
const props = defineProps<{
  originId: string;
}>();
const darkModeStore = useDarkModeStore();

const origin = ref<OriginView | undefined>();

onBeforeMount(async () => {
  origin.value = originStore.origins.find((o) => o._id === props.originId);
  if (!origin.value) {
    const syncRes = await originStore.fetchOrigins();
    if (!syncRes.success) {
      apiExceptionHandler.handleException(syncRes.error);
      return;
    }
    origin.value = originStore.origins.find((o) => o._id === props.originId);
  }
});
</script>
