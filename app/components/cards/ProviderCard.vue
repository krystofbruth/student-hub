<template>
  <Card class="cursor-pointer">
    <div class="min-h-20 p-2 relative w-full flex justify-center items-center">
      <div
        v-if="provider"
        class="flex flex-col md:flex-row gap-6 items-center w-full"
      >
        <img
          :src="
            darkModeStore.darkMode && provider.logoUriDark
              ? provider.logoUriDark
              : provider.logoUri
          "
          :alt="`${provider.name} logo`"
          class="h-full box-border max-h-20"
        />
        <p class="font-bold grow">
          {{ provider.name }}
        </p>
        <p class="hidden md:block">
          <UIcon name="lucide:arrow-right" class="size-7 text-muted basis-18" />
        </p>

        <p class="md:hidden absolute top-0 right-0">
          <UIcon name="lucide:arrow-up-right" class="text-muted size-7" />
        </p>
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
const darkModeStore = useDarkModeStore();

const provider = ref<ProviderView | undefined>();

onBeforeMount(async () => {
  provider.value = await providerStore.getProvider(props.providerId);
});
</script>
