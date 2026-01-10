<template>
  <NuxtLayout name="full-page-dialog">
    <template #left>
      <Logo />
      <ShortDescription class="grow basis-0" />
      <p class="text-gray-500 text-sm">
        <span v-if="$i18n.locale === 'en'"
          >Don't have an account?
          <NuxtLink
            class="font-bold hover:text-default transition ease-in-out duration-200"
            to="/register"
            >Register here</NuxtLink
          ></span
        >
        <span v-else-if="$i18n.locale === 'cs'"
          >Nemáte účet?
          <NuxtLink
            class="font-bold hover:text-default transition ease-in-out duration-200"
            to="/register"
            >Registrujte se zde</NuxtLink
          ></span
        >
      </p>
    </template>
    <template #right>
      <LanguageSwitch />
      <h2 class="text-2xl font-bold">Login</h2>
      <UForm
        ref="login-form"
        :state="state"
        class="flex flex-col gap-3 items-stretch"
        :validate-on="['blur']"
        :validate="handleValidation"
        @submit="handleSubmit"
      >
        <UFormField label="Username (E-mail)" name="email">
          <UInput
            v-model="state.email"
            :placeholder="$t('pages.login.emailPlaceholder')"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Password" name="password">
          <UInput
            v-model="state.password"
            type="password"
            :placeholder="$t('pages.login.passwordPlaceholder')"
            class="w-full"
          />
        </UFormField>

        <UButton
          v-if="!loadingResponse"
          type="submit"
          class="hover:cursor-pointer"
        >
          {{ $t("pages.login.loginButton") }}
        </UButton>
        <UButton
          v-else
          type="submit"
          class="grayscale-25 cursor-wait hover:bg-primary"
        >
          {{ $t("pages.login.loginButton") }}
        </UButton>
      </UForm>
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { FormError, FormSubmitEvent } from "@nuxt/ui";
import {
  type LoginRequest,
  LoginRequestSchema,
} from "#shared/types/LoginRequest";
import { useAuthorizationStore } from "#imports";
import { useRouter } from "vue-router";
import Logo from "~/components/brand/Logo.vue";
import LanguageSwitch from "~/components/i18n/LanguageSwitch.vue";
import ShortDescription from "~/components/brand/ShortDescription.vue";
import z from "zod";

const authorizationStore = useAuthorizationStore();
const router = useRouter();
const state = reactive<Partial<LoginRequest>>({
  email: "",
  password: "",
});
const loadingResponse = ref(false);
const i18n = useI18n();
const loginForm = useTemplateRef("login-form");

// If locale changes, the errors need to be refreshed :C
watch(i18n.locale, () => {
  loginForm.value?.setErrors(handleValidation());
});

const handleValidation = (): FormError[] => {
  const errors: FormError[] = [];

  const data = { email: state.email, password: state.password };
  const validation = z.safeParse(LoginRequestSchema, data);
  if (!validation.success) {
    for (const error of validation.error.issues) {
      errors.push({
        name: error.path[0] as string,
        message: $t(`pages.login.errors.${error.path}`),
      });
    }
  }

  return errors;
};

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
    // @ts-expect-error - Have to read whether the error is a response from the server or other (network problem).
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
