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
      <UForm
        :schema="LoginRequestSchema"
        :state="state"
        @submit="handleSubmit"
        class="flex flex-col gap-3 items-stretch"
      >
        <UFormField label="Username (E-mail)" name="email">
          <UInput
            v-model="state.email"
            placeholder="Enter your username"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Password" name="password">
          <UInput
            v-model="state.password"
            type="password"
            placeholder="Enter your password"
            class="w-full"
          />
        </UFormField>

        <UButton type="submit"> Log-in </UButton>
      </UForm>
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import {
  type LoginRequest,
  LoginRequestSchema,
} from "#shared/types/LoginRequest";

const state = reactive<Partial<LoginRequest>>({
  email: undefined,
  password: undefined,
});

const toast = useToast();
const handleSubmit = (submission: FormSubmitEvent<LoginRequest>) => {
  toast.add({
    title: "Success",
    description: "The form has been submitted.",
    color: "success",
  });
  console.log(submission);
};
</script>
