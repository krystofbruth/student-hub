<template>
  <article class="rounded-md box-border flex items-center h-fit gap-3">
    <p class="font-bold">Your Name</p>
    <img
      class="object-fill rounded-full h-8"
      src="/unknown-user.jpg"
      alt="User's profile picture"
    />
  </article>
</template>

<script setup lang="ts">
const props = defineProps<{
  profileId: "me" | string;
}>();
</script>
