<template>
  <div class="p-4 box-border flex justify-center">
    <img
      v-if="darkMode"
      src="/logo-dark.svg"
      alt="Logo of the StudentHub app (dark variant)"
      class="w-70"
    />
    <img
      v-else
      src="/logo-light.svg"
      alt="Logo of the StudentHub app (light variant)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const darkMode = ref(false);

const handleModeChange = () => {
  const classList = document.documentElement.classList;

  if (classList.contains("dark")) darkMode.value = true;
  else darkMode.value = false;
};

const observer: MutationObserver = new MutationObserver(handleModeChange);

onMounted(() => {
  observer.observe(document.documentElement, { attributes: true });
  handleModeChange();
});

onUnmounted(() => {
  observer.disconnect();
});
</script>
