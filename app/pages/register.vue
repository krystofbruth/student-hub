<template>
  <NuxtLayout name="full-page-dialog">
    <template #left>
      <div class="h-full md:max-w-xl flex flex-col gap-4 justify-between">
        <section class="flex flex-col gap-4 w-full">
          <Logo class="max-h-25 md:max-h-20" />
          <p class="font-bold text-4xl max-w-full text-center">
            INSERT SOME COOL INFOGRAPHIC
          </p>
          <ShortDescription class="hidden md:block" />
        </section>

        <footer>
          <p class="text-muted text-sm">
            <!-- fuuuj -->
            <span v-if="$i18n.locale === 'en'"
              >Already have an account?
              <NuxtLink
                class="font-bold hover:text-default transition ease-in-out duration-200"
                to="/login"
                >Log-in instead</NuxtLink
              ></span
            >
            <span v-else-if="$i18n.locale === 'cs'"
              >Již máte účet?
              <NuxtLink
                class="font-bold hover:text-default transition ease-in-out duration-200"
                to="/login"
                >Přihlašte se</NuxtLink
              ></span
            >
          </p>
        </footer>
      </div>
    </template>
    <template #right>
      <div class="md:max-w-xl h-full flex flex-col gap-4">
        <h2 class="text-2xl font-bold">{{ $t("pages.register.title") }}</h2>
        <UForm
          :state="state"
          class="flex flex-col gap-4"
          :validate="handleValidation"
          :validate-on="['blur']"
          :schema="registerFormSchema"
          @submit="handleSubmit"
          ref="registerForm"
        >
          <UFormField
            :label="$t('pages.register.displayNameLabel')"
            name="displayName"
          >
            <UInput
              :placeholder="$t('pages.register.displayNamePlaceholder')"
              v-model="state.displayName"
              class="w-full"
            ></UInput>
          </UFormField>

          <UFormField :label="$t('pages.register.emailLabel')" name="email">
            <UInput
              :placeholder="$t('pages.register.emailPlaceholder')"
              v-model="state.email"
              class="w-full"
            ></UInput>
          </UFormField>

          <UFormField
            :label="$t('pages.register.passwordLabel')"
            name="password"
          >
            <UInput
              :placeholder="$t('pages.register.passwordPlaceholder')"
              v-model="state.password"
              class="w-full"
              type="password"
            ></UInput>
          </UFormField>

          <PasswordChecker :password="state.password" v-model="passwordValid" />

          <UFormField
            :label="$t('pages.register.confirmPasswordLabel')"
            name="confirmPassword"
          >
            <UInput
              :placeholder="$t('pages.register.confirmPasswordPlaceholder')"
              v-model="state.confirmPassword"
              class="w-full"
              type="password"
            ></UInput>
          </UFormField>

          <UButton
            class="flex justify-between items-center cursor-pointer"
            type="submit"
            >{{ $t("pages.register.registerButton")
            }}<UIcon class="size-4" name="lucide:arrow-right"
          /></UButton>
        </UForm>
      </div>
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "@nuxt/ui";
import z from "zod";
import Logo from "~/components/brand/Logo.vue";
import ShortDescription from "~/components/brand/ShortDescription.vue";
import PasswordChecker from "~/components/utilities/PasswordChecker.vue";
import { ApiException } from "~/types/Exceptions";

const registerFormSchema = CreateUserRequestSchema.extend({
  confirmPassword: z.string(),
});

const state = reactive({
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
});
const passwordValid = ref(false);
const i18n = useI18n();
const registerForm = useTemplateRef("registerForm");
const apiExceptionHandler = useApiExceptionErrorHandler();
const toast = useToast();
const router = useRouter();

watch(i18n.locale, () => {
  if (!registerForm.value) return;
  if (registerForm.value.getErrors().length > 0)
    registerForm.value?.setErrors(handleValidation(state));
});

const handleValidation = (currentState: Partial<typeof state>): FormError[] => {
  const errors: FormError[] = [];

  const parse = z.safeParse(CreateUserRequestSchema, state);

  if (!parse.success) {
    for (const error of parse.error.issues) {
      errors.push({
        name: error.path[0] as string,
        message: $t(`pages.register.errors.${error.path[0] as string}`),
      });
    }
  }

  if (!passwordValid.value) {
    errors.push({
      name: "password",
      message: $t(`pages.register.errors.password`),
    });
  } else if (state.confirmPassword !== state.password) {
    errors.push({
      name: "confirmPassword",
      message: $t(`pages.register.errors.confirmPassword`),
    });
  }

  return errors;
};

const handleSubmit = async (
  event: FormSubmitEvent<z.infer<typeof registerFormSchema>>,
) => {
  const res = await request<CreateUserRequest, CreateUserResponse>(
    "/api/user",
    {
      method: "POST",
      body: {
        email: event.data.email,
        password: event.data.password,
        displayName: event.data.displayName,
      },
    },
  );

  if (!res.success) {
    if (
      !(res.error instanceof ApiException) ||
      res.error.reason !== "error_response"
    )
      return apiExceptionHandler.handleException(res.error);

    if (res.error.details.response?.status === 409) {
      toast.add({
        title: $t("pages.register.errorResponses.conflict.title"),
        description: $t("pages.register.errorResponses.conflict.description"),
        color: "error",
      });
    } else if (
      res.error.details.response &&
      res.error.details.response.code === ErrorCodes.VALIDATION_ERROR &&
      (res.error.details.response as ValidationErrorResponse).issues.email?.at(
        0,
      ) === "domain-not-allowed"
    ) {
      toast.add({
        title: $t("pages.register.errorResponses.domain-not-allowed.title"),
        description: $t(
          "pages.register.errorResponses.domain-not-allowed.description",
        ),
        color: "error",
      });
    } else {
      apiExceptionHandler.handleException(res.error);
    }

    return;
  }

  let redirectionUri: string;
  // switch (res.data.registrationStatus) {
  switch (UserRegistrationStatus.USER_ACTIVE) {
    // case UserRegistrationStatus.EMAIL_VERIFICATION_REQUIRED:
    //   redirectionUri = "/user-registration-result/active";
    //   break;
    default:
      console.error("No user registration status advised in response!");
    case UserRegistrationStatus.USER_ACTIVE:
      redirectionUri = "/user-registration-result/active";
      break;
  }

  router.push(redirectionUri);
};
</script>
