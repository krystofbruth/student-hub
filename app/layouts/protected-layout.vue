<template>
  <div class="flex flex-col gap-1 w-full">
    <header
      class="hidden w-full md:flex justify-between items-center gap-3 box-border py-4 px-6 relative"
    >
      <section class="flex gap-4 items-center">
        <NuxtLink to="/dashboard"><Logo class="h-8" /> </NuxtLink>
        <p class="font-bold">
          {{ $t(`pages.${$route.name?.toString()}.title`) }}
        </p>
      </section>

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
    <hr class="text-neutral-400" />
    <main class="box-border p-5 flex flex-col gap-5 w-full items-center">
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

const route = useRoute();

const handleNavigationClose = () => {
  navigationOpen.value = false;
};
</script>
