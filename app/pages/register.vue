<template>
  <NuxtLayout name="full-page-dialog">
    <template #left>
      <Logo />
      <ShortDescription />
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
    </template>
    <template #right>
      <h2 class="text-2xl font-bold">{{ $t("pages.register.title") }}</h2>
      <UForm :state="state" class="flex flex-col gap-4">
        <UFormField :label="$t('pages.register.displayNameLabel')">
          <UInput
            :placeholder="$t('pages.register.displayNamePlaceholder')"
            v-model="state.displayName"
            class="w-full"
          ></UInput>
        </UFormField>

        <UFormField :label="$t('pages.register.emailLabel')">
          <UInput
            :placeholder="$t('pages.register.emailPlaceholder')"
            v-model="state.email"
            class="w-full"
          ></UInput>
        </UFormField>

        <UFormField :label="$t('pages.register.passwordLabel')">
          <UInput
            :placeholder="$t('pages.register.passwordPlaceholder')"
            v-model="state.password"
            class="w-full"
            type="password"
          ></UInput>
        </UFormField>

        <PasswordChecker :password="state.password" />

        <UButton class="flex justify-between items-center"
          >{{ $t("pages.register.registerButton")
          }}<UIcon class="size-4" name="lucide:arrow-right"
        /></UButton>
      </UForm>
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
import Logo from "~/components/brand/Logo.vue";
import ShortDescription from "~/components/brand/ShortDescription.vue";
import PasswordChecker from "~/components/utilities/PasswordChecker.vue";

const state = reactive({
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
});
</script>
