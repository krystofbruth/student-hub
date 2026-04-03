<template>
  <NuxtLayout v-if="profile" name="protected-layout">
    <section
      class="grid grid-cols-1 md:grid-cols-[repeat(2,var(--container-md))] items-stretch justify-center w-full gap-4 align-top"
    >
      <Container>
        <template #header>
          <section class="flex items-center gap-2">
            <UIcon name="lucide:paintbrush" class="size-6" />
            <p class="font-bold text-lg">
              {{ $t("pages.settings.appearance.title") }}
            </p>
          </section>
        </template>

        <template #body>
          <UForm class="box-border flex flex-col gap-2">
            <section>
              <UFormField :label="$t('pages.settings.appearance.color-scheme')">
                <section class="flex justify-start gap-2">
                  <XButton
                    icon-key="lucide:sun"
                    :color="
                      $colorMode.preference === 'light' ? 'primary' : 'neutral'
                    "
                    :variant="
                      $colorMode.preference === 'light' ? 'solid' : 'outline'
                    "
                    @click="selectColorScheme('light')"
                  />
                  <XButton
                    icon-key="lucide:moon"
                    :color="
                      $colorMode.preference === 'dark' ? 'primary' : 'neutral'
                    "
                    :variant="
                      $colorMode.preference === 'dark' ? 'solid' : 'outline'
                    "
                    @click="selectColorScheme('dark')"
                  />
                  <XButton
                    icon-key="lucide:settings"
                    :color="
                      $colorMode.preference === 'system' ? 'primary' : 'neutral'
                    "
                    :variant="
                      $colorMode.preference === 'system' ? 'solid' : 'outline'
                    "
                    @click="selectColorScheme('system')"
                  />
                </section>
              </UFormField>
            </section>
          </UForm>
        </template>
      </Container>

      <Container>
        <template #header>
          <section class="flex items-center gap-2">
            <UIcon name="lucide:square-user-round" class="size-6" />
            <p class="font-bold text-lg">
              {{ $t("pages.settings.profile-title") }}
            </p>
          </section>
        </template>

        <template #body>
          <UForm class="box-border flex flex-col gap-2">
            <section>
              <UFormField :label="$t('pages.settings.displayNameLabel')">
                <UInput :default-value="profile!.displayName" class="w-full" />
              </UFormField>
            </section>
            <footer class="w-full flex justify-end">
              <XButton
                title-key="pages.settings.saveButton"
                icon-key="lucide:check"
              />
            </footer>
          </UForm>
        </template>
      </Container>

      <Container>
        <template #header>
          <section class="flex items-center gap-2">
            <UIcon name="lucide:lock-keyhole" class="size-6" />
            <p class="font-bold text-lg">
              {{ $t("pages.settings.security.title") }}
            </p>
          </section>
        </template>

        <template #body>
          <UForm class="box-border flex flex-col gap-2">
            <header class="flex items-center gap-2"></header>
            <section class="flex flex-col gap-4">
              <p class="font-bold">Activity</p>
              <section>
                <p>Review sign-in activity</p>
              </section>
              <hr class="text-neutral-400" />
              <p class="font-bold">
                {{ $t("pages.settings.security.change-password-title") }}
              </p>
              <section class="flex flex-col gap-3">
                <UFormField
                  :label="$t('pages.settings.security.current-password-input')"
                >
                  <UInput type="password" class="w-full" />
                </UFormField>
                <UFormField
                  :label="$t('pages.settings.security.new-password-input')"
                >
                  <UInput type="password" class="w-full" />
                </UFormField>
                <UFormField
                  :label="
                    $t('pages.settings.security.new-password-repeat-input')
                  "
                >
                  <UInput type="password" class="w-full" />
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
        </template>
      </Container>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import Container from "~/components/containers/Container.vue";
import XButton from "~/components/utilities/XButton.vue";

definePageMeta({
  middleware: "auth",
});

const profileStore = useProfileStore();
const profile = storeToRefs(profileStore).profile;

const colorMode = useColorMode();

const selectColorScheme = (scheme: "light" | "dark" | "system") => {
  colorMode.preference = scheme;
};

onBeforeMount(async () => {
  if (!profile.value) await profileStore.fetchProfile();
});
</script>
