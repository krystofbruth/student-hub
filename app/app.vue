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

useSeoMeta({
  ogTitle: "StudentHub",
  description:
    "StudentHub je aplikace pro snadnou agregaci veškerých organizačních dat školy.",
  ogDescription:
    "StudentHub je aplikace pro snadnou agregaci veškerých organizačních dat školy.",
  ogImage: "https://studenthub.bruthans.eu/logo-light.svg",
  robots: "noindex,nofollow",
});
</script>
