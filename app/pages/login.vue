<template>
  <NuxtLayout name="full-page-dialog">
    <template #left>
      <Logo />
      <p>
        StudentHub is a data aggregation platform for conveniently viewing all
        deadlines & information. Never miss another announcement again!
      </p>
      <p class="text-gray-500 text-sm">
        Don't have an account?
        <NuxtLink
          class="font-bold hover:text-default transition ease-in-out duration-200"
          to="/register"
          >Register here</NuxtLink
        >
      </p>
    </template>
    <template #right>
      <h2 class="text-2xl font-bold">Login</h2>
      <form @submit.prevent=""></form>
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
// TBD
</script>
