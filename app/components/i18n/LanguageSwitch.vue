<template>
  <button
    class="flex items-center gap-1 text-muted hover:cursor-pointer"
    @click="handleLocaleSwitch"
  >
    <UIcon name="lucide:languages" />
    {{ locale }}
  </button>
</template>

<script setup lang="ts">
const { setLocale, locale } = useI18n();

const handleLocaleSwitch = () => {
  switch (locale.value) {
    case "en":
      setLocale("cs");
      break;
    case "cs":
    default:
      setLocale("en");
      break;
  }
};
</script>
