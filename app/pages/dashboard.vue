<template>
  <NuxtLayout name="protected-layout">
    <div class="flex flex-col gap-3">
      <h1>{{ $t("pages.dashboard.title") }}</h1>
      <AssignmentView />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import AssignmentView from "~/components/modules/AssignmentView.vue";

definePageMeta({
  middleware: "auth",
  layout: "protected-layout",
});
</script>
