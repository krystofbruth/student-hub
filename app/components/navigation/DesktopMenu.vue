<template>
  <article
    class="bg-accented absolute -top-3 -right-3 -z-10 rounded-md shadow-xl p-4 min-w-56 w-[calc(100%+4rem)] pointer-events-none"
    ref="menuRoot"
  >
    <nav>
      <ul class="flex flex-col gap-5 items-start pt-14">
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
          <NuxtLink to="/protected/settings">{{
            $t("navigation.settings")
          }}</NuxtLink>
        </li>
        <li>
          <a class="hover:cursor-pointer" @mouseup="handleLogout">{{
            $t("navigation.log-out")
          }}</a>
        </li>
        <li>
          <LanguageSwitch />
        </li>
      </ul>
    </nav>
  </article>
</template>

<script setup lang="ts">
import { useAuthorizationStore } from "#imports";
import LanguageSwitch from "~/components/i18n/LanguageSwitch.vue";
const authorizationStore = useAuthorizationStore();

const route = useRoute();
const menuRootElement = useTemplateRef("menuRoot");
const props = defineProps<{ closeMenu: () => void }>();
useMouseDetection(menuRootElement, () => undefined, props.closeMenu);

const handleLogout = () => {
  authorizationStore.logoutUser();
};

watch(route, () => {
  props.closeMenu();
});
</script>

<style lang="css" scoped>
nav > ul > li {
  pointer-events: all;
}
</style>
