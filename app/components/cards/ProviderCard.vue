<template>
  <Card class="cursor-pointer">
    <div class="min-h-20 p-2 relative w-full flex justify-center items-center">
      <div
        v-if="provider"
        class="flex flex-col md:flex-row gap-6 items-center w-full"
      >
        <img
          src="/schools-meta/ssps/logo.svg"
          alt="Logo SSPS"
          class="h-full box-border max-h-20"
        />
        <p class="font-bold grow">
          {{ provider.name }}
        </p>
        <UIcon
          name="lucide:arrow-right"
          class="size-7 text-muted basis-18 hidden md:block"
        />
        <UIcon
          name="lucide:arrow-up-right"
          class="text-muted absolute top-0 right-0 size-7 md:hidden"
        />
      </div>
      <p v-else class="text-error font-bold">
        {{ $t("components.Provider.couldNotFetchProvider") }}
      </p>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { useProviderStore } from "~/stores/ProviderStore";
import Card from "./Card.vue";

const props = defineProps<{
  providerId: string;
}>();
const providerStore = useProviderStore();

const provider = ref<ProviderView | undefined>();

onBeforeMount(async () => {
  provider.value = await providerStore.getProvider(props.providerId);
});
</script>
