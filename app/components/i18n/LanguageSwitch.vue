<template>
  <button class="hover:cursor-pointer" @click="handleLocaleSwitch">
    {{ $t("changeLanguage") }}
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
