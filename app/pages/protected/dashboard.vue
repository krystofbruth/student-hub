<template>
  <div class="flex flex-col gap-3">
    <h1>{{ $t("pages.dashboard.title") }}</h1>
    <AssignmentView />
  </div>
</template>

<script setup lang="ts">
import AssignmentView from "~/components/modules/AssignmentView.vue";
</script>
