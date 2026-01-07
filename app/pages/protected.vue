<template>
  <NuxtLayout name="protected-layout">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useAuthorizationStore } from "~/stores/AuthorizationStore";

const authorizationStore = useAuthorizationStore();
// Triggers login redirect if not valid
await authorizationStore.getAuthorization();
</script>
