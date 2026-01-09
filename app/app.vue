<template>
  <UApp :locale="nuxtUiLocales[$i18n.locale]">
    <NuxtPage />
  </UApp>
</template>

<script setup lang="ts">
import { cs, en } from "@nuxt/ui/locale";
import type { Messages, Locale as NuxtUILocale } from "@nuxt/ui";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const i18n = useI18n();

const nuxtUiLocales: Record<
  typeof i18n.locale.value,
  NuxtUILocale<Messages>
> = {
  cs: cs,
  en: en,
};
</script>
