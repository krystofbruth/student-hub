<template>
  <div class="flex flex-col gap-3 items-center">
    <p>{{ $t("integrations.teams.instructions") }}</p>
    <UButton
      color="info"
      class="w-fit cursor-pointer"
      @click="handleTeamsLogin"
    >
      <UIcon name="mdi:microsoft" />
      {{ $t("integrations.teams.connectButton") }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { setOriginState } from "~/utils/integrations/teams/OriginState";
import { loginUri } from "~~/shared/types/integrations/teams/AuthorizationFlow";

const props = defineProps<{ origin: OriginView; closeSuccess: () => void }>();

const handleTeamsLogin = () => {
  setOriginState(props.origin._id);
  window.location.href = loginUri;
};
</script>
