<script setup lang="ts">
import { ref } from "vue";

const name = ref("");
const response = ref("");

const handleRegister = async () => {
  const req = await useFetch("/api/user", { method: "POST", body: { name } });
  response.value = req.data.value?.success ?? "undefined";
};
</script>

<template>
  <h1>Register</h1>

  <h2>Enter details</h2>
  <form @submit.prevent="handleRegister">
    <input type="text" v-model="name" />
    <input type="submit" value="Submit" />
  </form>

  <h2>Response</h2>
  <div>{{ response }}</div>
</template>
