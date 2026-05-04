<template>
  <Container>
    <template #header>
      <section class="flex items-center gap-2">
        <UIcon name="lucide:lock-keyhole" class="size-6" />
        <p class="font-bold text-lg">
          {{ $t("pages.settings.security.title") }}
        </p>
      </section>
    </template>

    <template #body>
      <UForm
        ref="securityForm"
        class="box-border flex flex-col gap-2"
        :state="state"
        :validate="handleValidation"
        :validate-on="['blur']"
        :disabled="passwordStateHandler.isLoading.value"
        @submit="passwordStateHandler.handle"
      >
        <section class="flex flex-col gap-4">
          <p class="font-bold">
            {{ $t("pages.settings.security.change-password-title") }}
          </p>
          <section class="flex flex-col gap-3">
            <UFormField
              :label="$t('pages.settings.security.current-password-input')"
              name="oldPassword"
            >
              <UInput
                v-model="state.oldPassword"
                type="password"
                class="w-full"
              />
            </UFormField>

            <UFormField
              :label="$t('pages.settings.security.new-password-input')"
              name="newPassword"
            >
              <UInput
                v-model="state.newPassword"
                type="password"
                class="w-full"
              />
            </UFormField>

            <PasswordChecker
              :password="state.newPassword"
              v-model="passwordValid"
            />

            <UFormField
              :label="$t('pages.settings.security.new-password-repeat-input')"
              name="repeatPassword"
            >
              <UInput
                v-model="state.repeatPassword"
                type="password"
                class="w-full"
              />
            </UFormField>
          </section>

          <footer class="w-full flex justify-end">
            <XButton
              title-key="pages.settings.changePasswordButton"
              icon-key="lucide:check"
              type="submit"
              :is-loading="passwordStateHandler.isLoading.value"
            />
          </footer>
        </section>
      </UForm>
    </template>
  </Container>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "@nuxt/ui";
import z from "zod";
import Container from "~/components/containers/Container.vue";
import PasswordChecker from "~/components/utilities/PasswordChecker.vue";
import XButton from "~/components/utilities/XButton.vue";
import type { UpdateUserPasswordRequest } from "#shared/types/UpdateUserPasswordRequest";
import type { UpdateUserPasswordResponse } from "#shared/types/UpdateUserPasswordResponse";
import { ErrorCodes } from "#shared/types/ErrorResponse";
import { ApiException } from "~/types/Exceptions";

const state = reactive({
  oldPassword: "",
  newPassword: "",
  repeatPassword: "",
});

const passwordValid = ref(false);
const toast = useToast();
const i18n = useI18n();
const apiExceptionHandler = useApiExceptionErrorHandler();
const securityForm = useTemplateRef("securityForm");

const handleValidation = (): FormError[] => {
  const errors: FormError[] = [];
  const parse = z
    .object({
      oldPassword: z.string().min(1),
      newPassword: z.string().min(1),
      repeatPassword: z.string().min(1),
    })
    .safeParse(state);

  if (!parse.success) {
    for (const issue of parse.error.issues) {
      errors.push({
        name: issue.path[0] as string,
        message: $t(
          `pages.settings.security.errors.${issue.path[0] as string}`,
        ),
      });
    }
  }

  if (!passwordValid.value) {
    errors.push({
      name: "newPassword",
      message: $t("pages.settings.security.errors.newPasswordStrength"),
    });
  } else if (state.repeatPassword !== state.newPassword) {
    errors.push({
      name: "repeatPassword",
      message: $t("pages.settings.security.errors.passwordsMismatch"),
    });
  }

  return errors;
};

watch(i18n.locale, () => {
  if (!securityForm.value) return;
  if (securityForm.value.getErrors().length > 0)
    securityForm.value.setErrors(handleValidation());
});

const handleSubmit = async (
  event: FormSubmitEvent<
    UpdateUserPasswordRequest & { repeatPassword: string }
  >,
) => {
  const res = await request<
    UpdateUserPasswordRequest,
    UpdateUserPasswordResponse
  >("/api/user/me/password", {
    method: "PUT",
    authRequired: true,
    body: {
      oldPassword: event.data.oldPassword,
      newPassword: event.data.newPassword,
    },
  });

  if (!res.success) {
    if (
      res.error instanceof ApiException &&
      res.error.details.response?.code === ErrorCodes.AUTHENTICATION_ERROR
    ) {
      toast.add({
        title: $t(
          "pages.settings.security.errorResponses.passwordMismatch.title",
        ),
        description: $t(
          "pages.settings.security.errorResponses.passwordMismatch.description",
        ),
        color: "error",
      });
      return;
    }

    apiExceptionHandler.handleException(res.error);
    return;
  }

  state.oldPassword = "";
  state.newPassword = "";
  state.repeatPassword = "";
  passwordValid.value = false;
  toast.add({
    title: $t("toasts.password.updateSuccess.title"),
    description: $t("toasts.password.updateSuccess.description"),
    color: "success",
  });
};

const passwordStateHandler = useStateHandler(handleSubmit);
</script>
