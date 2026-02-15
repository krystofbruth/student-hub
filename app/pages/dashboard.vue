<template>
  <NuxtLayout name="protected-layout">
    <div class="flex flex-col gap-3">
      <h1>{{ $t("pages.dashboard.title") }}</h1>
      <EventView />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import EventView from "~/components/modules/EventView.vue";

definePageMeta({
  middleware: "auth",
});
</script>
