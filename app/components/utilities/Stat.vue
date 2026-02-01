<template>
  <section>
    <p class="font-bold text-2xl" :style="{ color: props.color }">
      {{ value }}
    </p>
    <p class="text-muted">
      {{ $t(`components.Audit.labels.${props.label_key}`) }}
    </p>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  value: number;
  label_key: string;
  color: string;
}>();
</script>
