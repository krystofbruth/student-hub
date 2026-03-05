<template>
  <Card>
    <div
      class="flex flex-col items-center gap-4 p-2 box-border min-w-xs"
      v-if="source && origin"
    >
      <img
        class="w-18 h-18 object-contain"
        :src="origin.logoUri"
        :alt="`${origin.name[$i18n.locale]} logo`"
      />
      <div class="w-full flex flex-col gap-4">
        <p class="font-bold text-xl">{{ origin.name[$i18n.locale] }}</p>
        <section class="grow flex flex-col gap-2">
          <CardProperty label-key="components.Source.provider">
            <p v-if="origin.provider">{{ origin.provider.name }}</p>
            <p v-else>{{ $t("components.Source.universalProvider") }}</p>
          </CardProperty>
          <CardProperty label-key="components.Source.created">
            <p>{{ createdAt }}</p>
          </CardProperty>
        </section>

        <footer class="flex gap-2 flex-wrap">
          <UButton color="neutral" class="cursor-not-allowed"
            ><UIcon name="lucide:info" />
            {{ $t("components.Source.actions.moreInfo") }}</UButton
          >
          <SourceDeletionModal :source="source" />
        </footer>
      </div>
    </div>
    <div
      v-else
      class="flex flex-col gap-3 items-center justify-center p-2 box-border h-full"
    >
      <UIcon name="lucide:file-exclamation-point" class="size-18 text-muted" />
      <p class="text-muted font-bold select-none">
        {{ $t("components.Source.loadFailure") }}
      </p>
    </div>
  </Card>
</template>

<script setup lang="ts">
import SourceDeletionModal from "../modals/SourceDeletionModal.vue";
import CardProperty from "../utilities/CardProperty.vue";
import Card from "./Card.vue";

const i18n = useI18n();
const toast = useToast();
const sourceStore = useSourceStore();
const props = defineProps<{ sourceId: string }>();
const apiExceptionHandler = useApiExceptionErrorHandler();
const emits = defineEmits(["unlink"]);

const source = ref<SourceView | undefined>();
const origin = ref<OriginView | undefined>();

const createdAt = computed(() => {
  if (!source.value) return "";
  const locale = i18n.locale;
  const creationDate = new Date(source.value.createdAt);
  return creationDate.toLocaleDateString(locale.value);
});

onBeforeMount(async () => {
  source.value = sourceStore.sources.find((s) => s._id === props.sourceId);
  if (!source.value) {
    const syncRes = await sourceStore.fetchSources();
    if (!syncRes.success) {
      apiExceptionHandler.handleException(syncRes.error);
      return;
    }
    source.value = sourceStore.sources.find((s) => s._id === props.sourceId);
    if (!source.value) return;
  }

  origin.value = source.value.origin;
});
</script>
