<template>
  <NuxtLayout name="full-page-dialog">
    <template #left>
      <Logo />
      <ShortDescription class="grow basis-0" />
      <p class="text-muted text-sm">
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
      <h2 class="text-2xl font-bold">{{ $t("pages.login.title") }}</h2>
      <UForm
        ref="login-form"
        :state="state"
        class="flex flex-col gap-3 items-stretch"
        :validate-on="['blur']"
        :validate="handleValidation"
        @submit="handleSubmit"
      >
        <UFormField :label="$t('pages.login.emailLabel')" name="email">
          <UInput
            v-model="state.email"
            :placeholder="$t('pages.login.emailPlaceholder')"
            class="w-full"
          />
        </UFormField>
        <UFormField :label="$t('pages.login.passwordLabel')" name="password">
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
          class="hover:cursor-pointer flex justify-between items-center"
        >
          <span>{{ $t("pages.login.loginButton") }}</span>
          <span class="flex items-center"
            ><UIcon class="size-4" name="lucide:log-in"
          /></span>
        </UButton>
        <UButton
          v-else
          type="submit"
          class="grayscale-25 cursor-wait hover:bg-primary flex justify-between items-center"
        >
          <span>{{ $t("pages.login.loginButton") }}</span>
          <span><UIcon class="size-full" name="material:log-in" /></span>
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
      if (error.path[0] === "email" && !state.email) continue;
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
    "returnTo",
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
      submission.data.password,
    );

    if (loginAttempt === true) {
      toast.add({
        title: i18n.t("toasts.login.success.title"),
        description: i18n.t("toasts.login.success.description"),
        color: "success",
      });
      redirect();
    } else {
      toast.add({
        title: i18n.t("toasts.login.invalid-credentials.title"),
        description: i18n.t("toasts.login.invalid-credentials.description"),
        color: "error",
      });
    }
  } catch (error) {
    // @ts-expect-error - Have to read whether the error is a response from the server or other (network problem).
    if (error && error.status)
      toast.add({
        title: i18n.t("toasts.errors.server.title"),
        description: i18n.t("toasts.generic-errors.server.description"),
        color: "warning",
      });
    else
      toast.add({
        title: i18n.t("toasts.errors.network.title"),
        description: i18n.t("toasts.generic-errors.network.description"),
        color: "warning",
      });
  } finally {
    loadingResponse.value = false;
  }
};
</script>
