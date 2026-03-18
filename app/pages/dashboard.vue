<template>
  <NuxtLayout name="protected-layout">
    <h1>{{ $t("pages.dashboard.title") }}</h1>
    <EventView />
  </NuxtLayout>
</template>

<script setup lang="ts">
import EventView from "~/components/modules/EventView.vue";

definePageMeta({
  middleware: "auth",
});
</script>
