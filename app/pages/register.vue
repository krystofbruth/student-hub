<template>
  <NuxtLayout name="full-page-dialog">
    <template #left>
      <Logo />
      <ShortDescription />
      <p class="text-gray-500 text-sm">
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
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
import Logo from "~/components/brand/Logo.vue";
import ShortDescription from "~/components/brand/ShortDescription.vue";
</script>
