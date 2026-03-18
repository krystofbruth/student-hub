<template>
  <NuxtLayout name="protected-layout">
    <h1>{{ $t("pages.settings.title") }}</h1>
    <section
      class="grid grid-cols-1 md:grid-cols-2 max-w-7xl self-center w-full gap-4 align-top"
    >
      <UForm
        class="p-4 rounded-md bg-accented box-border flex flex-col gap-2 h-fit"
      >
        <header class="flex items-center gap-2">
          <UIcon name="lucide:square-user-round" class="size-6" />
          <p class="font-bold text-lg">
            {{ $t("pages.settings.profile-title") }}
          </p>
        </header>
        <section>
          <UFormField :label="$t('pages.settings.displayNameLabel')">
            <UInput
              :default-value="profile!.displayName"
              class="w-full max-w-xs"
            />
          </UFormField>
        </section>
        <footer class="w-full flex justify-end">
          <XButton
            title-key="pages.settings.saveButton"
            icon-key="lucide:check"
          />
        </footer>
      </UForm>

      <UForm
        class="p-4 rounded-md bg-accented box-border flex flex-col gap-2 h-fit"
      >
        <header class="flex items-center gap-2">
          <UIcon name="lucide:lock-keyhole" class="size-6" />
          <p class="font-bold text-lg">
            {{ $t("pages.settings.security.title") }}
          </p>
        </header>
        <section class="flex flex-col gap-4">
          <section class="flex flex-col gap-3">
            <UFormField
              :label="$t('pages.settings.security.current-password-input')"
            >
              <UInput type="password" class="w-full max-w-xs" />
            </UFormField>
            <UFormField
              :label="$t('pages.settings.security.new-password-input')"
            >
              <UInput type="password" class="w-full max-w-xs" />
            </UFormField>
            <UFormField
              :label="$t('pages.settings.security.new-password-repeat-input')"
            >
              <UInput type="password" class="w-full max-w-xs" />
            </UFormField>
          </section>
          <footer class="w-full flex justify-end">
            <XButton
              title-key="pages.settings.changePasswordButton"
              icon-key="lucide:check"
            />
          </footer>
        </section>
      </UForm>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import XButton from "~/components/utilities/XButton.vue";

const profileStore = useProfileStore();
const profile = storeToRefs(profileStore).profile;

onBeforeMount(async () => {
  if (!profile.value) await profileStore.fetchProfile();

  if (!profile.value)
    throw new Error("Settings page accessed without a valid profile!");
});
</script>
