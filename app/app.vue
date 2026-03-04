<template>
  <UApp :locale="nuxtUiLocales[$i18n.locale]">
    <NuxtPage />
    <footer class="fixed bottom-4 right-4 z-99">
      <AppMetaModal />
    </footer>
  </UApp>
</template>

<script setup lang="ts">
import { appVersion } from "#shared/utils/AppMeta";
import { cs, en } from "@nuxt/ui/locale";
import type { Messages, Locale as NuxtUILocale } from "@nuxt/ui";
import AppMetaModal from "./components/modals/AppMetaModal.vue";
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
