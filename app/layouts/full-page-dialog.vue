<template>
  <div
    class="flex items-center justify-center w-full min-h-screen p-0 relative"
  >
    <div
      class="bg-accented flex radius rounded-md p-8 box-border w-2xl gap-4 relative"
    >
      <div class="shrink-0 grow basis-0">
        <div class="min-w-0 flex flex-col gap-5 h-full">
          <slot name="left" />
        </div>
        <!-- Much more visible, but many risks: bumping into content, consistency... -->
        <!-- <language-switch class="absolute right-8 top-8" /> -->
      </div>
      <div class="basis-0.5 grow-0 bg-gray-400"></div>
      <div class="shrink-0 grow basis-0">
        <div class="min-w-0 flex flex-col gap-5">
          <slot name="right" />
        </div>
      </div>
    </div>
    <language-switch class="absolute right-8 bottom-4" />
  </div>
</template>

<script setup lang="ts">
import LanguageSwitch from "~/components/i18n/LanguageSwitch.vue";
</script>
