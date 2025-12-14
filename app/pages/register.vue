<template>
  <NuxtLayout name="full-page-dialog">
    <template #left>
      <Logo />
      <p>
        StudentHub is a data aggregation platform for conveniently viewing all
        deadlines & information. Never miss another announcement again!
      </p>
      <p class="text-gray-500 text-sm">
        Already have an account?
        <NuxtLink
          class="font-bold hover:text-default transition ease-in-out duration-200"
          to="/login"
          >Log-in instead</NuxtLink
        >
      </p>
    </template>
    <template #right>
      <h2 class="text-2xl font-bold">Register</h2>
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
import Logo from "~/components/Logo.vue";
</script>
