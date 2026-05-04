<template>
  <NuxtLayout name="protected-layout">
    <EventView />
  </NuxtLayout>
</template>

<script setup lang="ts">
import EventView from "~/components/modules/EventView.vue";

definePageMeta({
  middleware: "auth",
});
</script>
