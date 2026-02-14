<template>
  <UModal :title="$t('modals.sourceCreation.title')" v-model:open="open">
    <UButton class="cursor-pointer" color="info"
      ><UIcon name="lucide:link" />
      {{ $t("components.Origin.actions.connect") }}</UButton
    >

    <template #body>
      <div class="flex flex-col items-center gap-4">
        <div class="grid grid-cols-2 gap-4 h-20 justify-center">
          <img
            v-if="origin.provider"
            :src="origin.provider.logoUri"
            :alt="`${origin.provider.name} logo`"
            class="h-full w-auto max-h-20"
          />
          <img
            :src="origin.logoUri"
            :alt="`${origin.name[locale]} logo`"
            class="h-full w-auto max-h-20"
          />
        </div>
        <div>
          <p v-if="locale === 'cs'">
            Právě se chystáte připojit systém
            <span class="font-bold">{{ origin.name[locale] }}</span
            ><span v-if="origin.provider">
              poskytovatele
              <span class="font-bold">{{ origin.provider.name }}</span></span
            >.
          </p>
          <p v-if="locale === 'en'">
            You're now about to connect the
            <span class="font-bold">{{ origin.name[locale] }}</span>
            <span v-if="origin.provider">
              provided by
              <span class="font-bold">{{ origin.provider.name }}</span></span
            >.
          </p>
        </div>
        <hr class="w-full h-0.5 bg-accented text-transparent rounded-md" />
        <div class="w-full">
          <p class="font-bold">
            {{ $t("modals.sourceCreation.instructionsTitle") }}
          </p>
          <component
            :is="integrationComponent"
            :origin="props.origin"
            :closeSuccess="handleModalClose"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { RegisteredIntegrationNames } from "~~/shared/types/RegisteredIntegrationNames";
import CreateSSPSCajthamlSource from "../integrations/ssps_cajthaml/CreateSSPSCajthamlSource.vue";
import type { Component } from "vue";
import CreateTeamsSource from "../integrations/teams/CreateTeamsSource.vue";

const i18n = useI18n();
const locale = i18n.locale;
const open = ref(false);
const emits = defineEmits(["connected"]);
const toast = useToast();

const handleModalClose = () => {
  open.value = false;
  toast.add({
    title: $t("toasts.sources.creationSuccess.title"),
    description: $t("toasts.sources.creationSuccess.description"),
    color: "success",
  });
};

const mapIntegrationNameToSourceCreationComponent = (
  integrationName: RegisteredIntegrationNames,
): Component => {
  switch (integrationName) {
    case RegisteredIntegrationNames.SSPS_CAJTHAML:
      return CreateSSPSCajthamlSource;
    case RegisteredIntegrationNames.TEAMS:
      return CreateTeamsSource;
    default:
      throw new Error(`Integration mapping missing for ${integrationName}`);
  }
};

const props = defineProps<{
  origin: OriginView;
}>();

const integrationComponent = mapIntegrationNameToSourceCreationComponent(
  props.origin.integrationName,
);
</script>
