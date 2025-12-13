<template>
  <FullPageDialog>
    <template #left>
      <div class="min-w-0 flex flex-col gap-4">
        <Logo />
        <p>
          StudentHub is a data aggregation platform for conveniently viewing all
          deadlines & information. Never miss another announcement again!
        </p>
      </div>
    </template>
    <template #right>
      <div class="flex flex-col gap-1.5">
        <h2 class="text-2xl font-bold">Login</h2>
        <form @submit.prevent=""></form>
      </div>
    </template>
  </FullPageDialog>
  <UContainer> </UContainer>
</template>

<script setup lang="ts">
import FullPageDialog from "~/components/FullPageDialog.vue";

// To be
</script>
