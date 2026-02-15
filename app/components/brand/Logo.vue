<template>
  <div class="p-4 box-border flex justify-center">
    <img
      v-if="darkModeStore.darkMode"
      src="/logo-dark.svg"
      alt="Logo of the StudentHub app (dark variant)"
    />
    <img
      v-else
      src="/logo-light.svg"
      alt="Logo of the StudentHub app (light variant)"
      class="h-full w-full bg-contain max-w-full"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useDarkModeStore } from "~/stores/DarkModeStore";

const darkModeStore = useDarkModeStore();
</script>
