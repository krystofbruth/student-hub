<template>
  <div class="flex flex-col gap-1">
    <header
      class="hidden w-full md:flex justify-between items-center gap-3 box-border p-5 relative h-28"
    >
      <NuxtLink to="/dashboard" class="h-full"><Logo /></NuxtLink>

      <ProfileCard
        class="z-10 hover:cursor-pointer relative"
        profile-id="me"
        @click="navigationOpen = !navigationOpen"
      >
        <template #menu>
          <DesktopMenu
            v-if="navigationOpen"
            :close-menu="handleNavigationClose"
          />
        </template>
      </ProfileCard>
    </header>
    <main class="box-border p-5">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Logo from "~/components/brand/Logo.vue";
import DesktopMenu from "~/components/navigation/DesktopMenu.vue";
import ProfileCard from "~/components/cards/ProfileCard.vue";

const navigationOpen = ref(false);
const profileCardElement = useTemplateRef("profileCard");

const handleNavigationClose = () => {
  navigationOpen.value = false;
};
</script>
