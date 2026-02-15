<template>
  <section class="flex flex-col">
    <p class="text-muted font-bold text-sm">
      {{ $t(labelKey) }}
    </p>
    <slot></slot>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{ labelKey: string }>();
</script>
