<template>
  <UApp :locale="locale">
    <NuxtPage />
  </UApp>
</template>

<script setup lang="ts">
import { cs, en } from "@nuxt/ui/locale";
import { Locale, useLocaleStore } from "~/stores/LocaleStore";

const localeStore = useLocaleStore();

const locale = computed(() => {
  switch (localeStore.currentLocale) {
    case Locale.english:
      return en;
    case Locale.czech:
    default:
      return cs;
  }
});
</script>
