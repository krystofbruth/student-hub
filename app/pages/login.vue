<template>
  <NuxtLayout name="full-page-dialog">
    <template #left>
      <div class="max-w-xl h-fit flex flex-col gap-4">
        <Logo class="max-h-20" />
        <ShortDescription class="grow basis-0 hidden md:block" />
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
      </div>
    </template>
    <template #right>
      <div class="md:max-w-xl flex flex-col gap-4 justify-center">
        <h2 class="text-2xl font-bold">{{ $t("pages.login.title") }}</h2>
        <UForm
          ref="login-form"
          :state="state"
          class="flex flex-col gap-3 items-stretch"
          :validate-on="['blur']"
          :validate="handleValidation"
          @submit="loginStateHandler.handle"
          :disabled="loginStateHandler.isLoading.value"
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
            v-if="!loginStateHandler.isLoading.value"
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
            <span class="flex items-center"
              ><UIcon class="size-4 animate-spin" name="lucide:loader-circle"
            /></span>
          </UButton>
        </UForm>
      </div>
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
import Logo from "~/components/brand/Logo.vue";
import ShortDescription from "~/components/brand/ShortDescription.vue";
import z from "zod";
import { request } from "../utils/api";
import { ApiException, AuthReason } from "~/types/Exceptions";
import { useApiExceptionErrorHandler } from "~/composables/ApiExceptionErrorHandler";
import { getRedirectFromLoginPath } from "~/utils/loginRedirectPath";

const handleSubmit = async (submission: FormSubmitEvent<LoginRequest>) => {
  const res = await request<LoginRequest, LoginResponse>("/api/session", {
    method: "POST",
    body: submission.data,
  });

  if (!res.success) {
    if (
      res.error instanceof ApiException &&
      res.error.details.response &&
      res.error.details.response.status === 400
    )
      toast.add({
        title: i18n.t("toasts.login.invalid-credentials.title"),
        description: i18n.t("toasts.login.invalid-credentials.description"),
        color: "error",
      });
    else apiExceptionHandler.handleException(res.error);
    return;
  }

  saveCredentials(
    res.data.tokens.accessToken,
    new Date(res.data.accessTokenExpiration),
    res.data.tokens.refreshToken,
  );
  router.push(getRedirectFromLoginPath());
};

const state = reactive<Partial<LoginRequest>>({
  email: "",
  password: "",
});
const i18n = useI18n();
const router = useRouter();
const loginForm = useTemplateRef("login-form");
const toast = useToast();
const apiExceptionHandler = useApiExceptionErrorHandler();
const loginStateHandler = useStateHandler(handleSubmit);

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

onMounted(async () => {
  if ((await isAuthorized()).success)
    return router.push(getRedirectFromLoginPath());

  const reason = new URLSearchParams(window.location.search).get("reason") as
    | AuthReason
    | undefined;
  switch (reason) {
    case AuthReason.AUTH_INVALID:
      toast.add({
        title: i18n.t("toasts.auth.session-expired.title"),
        description: i18n.t("toasts.auth.session-expired.description"),
        color: "warning",
      });
      break;
    case AuthReason.AUTH_MISSING:
      toast.add({
        title: i18n.t("toasts.auth.log-in-required.title"),
        description: i18n.t("toasts.auth.log-in-required.description"),
        color: "error",
      });
      break;
    case AuthReason.AUTH_INTERCEPTED:
      toast.add({
        title: i18n.t("toasts.auth.auth-intercepted.title"),
        description: i18n.t("toasts.auth.auth-intercepted.description"),
        color: "error",
      });
      break;
    default:
      break;
  }
});
</script>
