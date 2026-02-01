<template>
  <div
    class="fixed left-0 top-0 w-screen h-screen bg-gray-950/80 z-50 flex items-center justify-center p-4"
  >
    <Card class="opacity-100">
      <header class="flex gap-1 items-center">
        <p class="font-bold text-sm grow">{{ $t(props.title_key) }}</p>
        <UIcon v-if="closable" name="lucide:x" class="size-5 text-muted" />
      </header>
      <slot></slot>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from "../cards/Card.vue";

const props = defineProps<{
  closable: boolean;
  title_key: string;
}>();
</script>
