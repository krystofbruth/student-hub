<!-- eslint-disable vue/html-self-closing -->
<template>
  <article
    class="bg-secondary rounded-md p-3 box-border cursor-pointer flex flex-col w-full h-fit"
  >
    <img class="w-20 h-20" :src="props.logoUri" :alt="`${title} logo`" />
    <p>{{ title }}</p>
    <p>{{ description[locale] }}</p>
  </article>
</template>

<script setup lang="ts">
const i18n = useI18n();
const locale = i18n.locale;

const props = defineProps<{
  title: string;
  logoUri: string;
  description: {
    en: string;
    cs: string;
  };
}>();
</script>
