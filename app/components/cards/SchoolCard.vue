<template>
  <Card class="cursor-pointer">
    <div
      class="flex flex-col md:flex-row gap-6 min-h-20 items-center p-2 relative"
    >
      <img
        src="/schools-meta/ssps/logo.svg"
        alt="Logo SSPS"
        class="h-full box-border max-h-20"
      />
      <p class="font-bold grow">
        Smíchovská střední průmyslová škola, gymnázium a hotelová škola
        radlická, příspěvková organizace
      </p>
      <UIcon
        name="lucide:arrow-right"
        class="size-7 text-muted basis-18 hidden md:block"
      />
      <UIcon
        name="lucide:arrow-up-right"
        class="text-muted absolute top-0 right-0 size-7 md:hidden"
      />
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from "./Card.vue";
</script>
