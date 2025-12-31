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
        :validateOnInputDelay="300"
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

        <UButton type="submit" v-if="!loadingResponse"> Log-in </UButton>
        <UButton
          type="submit"
          class="grayscale-25 cursor-wait hover:bg-primary"
          v-else
        >
          Logging-in
        </UButton>
      </UForm>
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { FormSubmitEvent } from "@nuxt/ui";
import {
  type LoginRequest,
  LoginRequestSchema,
} from "#shared/types/LoginRequest";
import { useAuthorizationStore } from "#imports";
import { useRouter } from "vue-router";

const authorizationStore = useAuthorizationStore();
const router = useRouter();
const state = reactive<Partial<LoginRequest>>({
  email: "",
  password: "",
});
const loadingResponse = ref(false);

const redirect = () => {
  const returnToPath = new URLSearchParams(window.location.search).get(
    "returnTo"
  );
  router.push(returnToPath || "/protected/dashboard");
};

if (await authorizationStore.isAuthorized()) redirect();

const toast = useToast();
const handleSubmit = async (submission: FormSubmitEvent<LoginRequest>) => {
  if (loadingResponse.value) return;
  loadingResponse.value = true;

  try {
    const loginAttempt = await authorizationStore.login(
      submission.data.email,
      submission.data.password
    );

    if (loginAttempt === true) {
      toast.add({
        title: "Log-in successful",
        description: "Log-in has been successful.",
        color: "success",
      });
      redirect();
    } else {
      toast.add({
        title: "Invalid username or password",
        description:
          "Authentication failure: either username or password were invalid.",
        color: "error",
      });
    }
  } catch (error) {
    // :C
    // @ts-ignore
    if (error && error.status)
      toast.add({
        title: "Server error",
        description:
          "An unexpected server error has occured, please try again later.",
        color: "warning",
      });
    else
      toast.add({
        title: "Network error",
        description: "Please check your internet connection and try again.",
        color: "warning",
      });
  } finally {
    loadingResponse.value = false;
  }
};
</script>
