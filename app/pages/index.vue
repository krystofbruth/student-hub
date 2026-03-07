<template>
  <h1>Index</h1>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: () => navigateTo("/login"),
});
</script>
