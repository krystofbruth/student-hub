<template>
  <div class="flex flex-col gap-1">
    <header
      class="w-full flex justify-between items-center gap-3 box-border p-5"
    >
      <Logo />
      <nav>
        <ul class="flex gap-5">
          <li>
            <NuxtLink to="/protected/dashboard">{{
              $t("navigation.dashboard")
            }}</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/protected/integrations">{{
              $t("navigation.integrations")
            }}</NuxtLink>
          </li>
          <li>
            <a class="hover:cursor-pointer" @click="handleLogout">Log-out</a>
          </li>
          <li>
            <LanguageSwitch />
          </li>
        </ul>
      </nav>
    </header>
    <hr class="text-gray-200" />
    <main class="box-border p-5">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import Logo from "~/components/brand/Logo.vue";
import { useAuthorizationStore } from "#imports";
import LanguageSwitch from "~/components/i18n/LanguageSwitch.vue";
const authorizationStore = useAuthorizationStore();

const handleLogout = () => {
  authorizationStore.logout();
};
</script>
