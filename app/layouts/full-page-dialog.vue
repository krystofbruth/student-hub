<template>
  <div
    class="flex flex-col items-center justify-center w-full min-h-screen box-border p-4 relative"
  >
    <div class="grow"></div>
    <div
      class="bg-accented grow-0 flex flex-col md:flex-row radius rounded-md p-6 md:p-8 box-border w-full md:w-fit h-fit gap-4 relative"
    >
      <language-switch class="self-end md:absolute right-8 top-8" />
      <div class="shrink-0 grow basis-0" v-if="$slots.left">
        <div class="min-w-0 flex flex-col gap-5 h-full">
          <slot name="left" />
        </div>
        <!-- Much more visible, but many risks: bumping into content, consistency... -->
      </div>
      <div
        v-if="$slots.right && $slots.left"
        class="basis-0.5 grow-0 bg-gray-400 hidden md:block"
      ></div>
      <div class="shrink-0 grow basis-0" v-if="$slots.right">
        <div class="min-w-0 flex flex-col gap-5">
          <slot name="right" />
        </div>
      </div>
    </div>
    <div class="grow flex items-end justify-end w-full p-4 md:p-8">
      <!-- <language-switch /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import LanguageSwitch from "~/components/i18n/LanguageSwitch.vue";
</script>
