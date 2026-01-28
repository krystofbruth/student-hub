<template>
  <article
    class="bg-accented absolute top-[-0.75rem] right-[-0.75rem] -z-10 rounded-md shadow-xl p-4 min-w-56 w-[calc(100%+4rem)]"
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

let boundingClientRect: DOMRect | undefined;

const handleLogout = () => {
  authorizationStore.logoutUser();
};

watch(route, () => {
  props.closeMenu();
});

const handleMouseUp = (e: MouseEvent) => {
  if (!boundingClientRect)
    throw new Error("Failed to get boundingClientRect for desktop menu.");

  const elementStartPositionX = boundingClientRect.x;
  const elementStartPositionY = boundingClientRect.y;
  const elementEndPositionX = elementStartPositionX + boundingClientRect.width;
  const elementEndPositionY = elementStartPositionY + boundingClientRect.height;
  if (
    !(
      e.clientX < elementEndPositionX &&
      e.clientX > elementStartPositionX &&
      e.clientY < elementEndPositionY &&
      e.clientY > elementStartPositionY
    )
  )
    props.closeMenu();
};

onMounted(() => {
  boundingClientRect = menuRootElement.value?.getBoundingClientRect();
  document.addEventListener("mouseup", handleMouseUp);
});

onUnmounted(() => {
  document.removeEventListener("mouseup", handleMouseUp);
});
</script>
