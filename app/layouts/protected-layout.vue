<template>
  <div class="flex flex-col gap-1">
    <header
      class="hidden w-full md:flex justify-between items-center gap-3 box-border p-5"
    >
      <NuxtLink to="/protected/dashboard"><Logo /></NuxtLink>

      <nav>
        <ul class="flex gap-5 items-center">
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
          <li>
            <NuxtLink to="/protected/settings">
              <ProfileCard profile-id="me" />
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </header>
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
  authorizationStore.logoutUser();
};
</script>
