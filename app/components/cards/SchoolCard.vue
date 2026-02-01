<template>
  <Card class="cursor-pointer">
    <div class="flex gap-4 h-20 items-center">
      <img
        src="/schools-meta/ssps/logo.svg"
        alt="Logo SSPS"
        class="h-full max-w-1/8 p-2 box-border"
      />
      <p class="font-bold">
        Smíchovská střední průmyslová škola, gymnázium a hotelová škola
        radlická, příspěvková organizace
      </p>
      <UIcon name="lucide:arrow-right" class="size-12 text-muted" />
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from "./Card.vue";
</script>
