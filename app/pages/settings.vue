<template>
  <NuxtLayout name="protected-layout">
    <section class="flex flex-col md:flex-row max-w-4xl w-full gap-4 align-top">
      <section class="flex flex-col gap-4 w-full">
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
                <UFormField
                  :label="$t('pages.settings.appearance.color-scheme')"
                >
                  <section class="flex justify-start gap-2">
                    <XButton
                      icon-key="lucide:sun"
                      :color="
                        $colorMode.preference === 'light'
                          ? 'primary'
                          : 'neutral'
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
                        $colorMode.preference === 'system'
                          ? 'primary'
                          : 'neutral'
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

        <SecuritySettings />
      </section>

      <section class="flex flex-col gap-4 w-full">
        <ProfileSettings />

        <Container>
          <template #header>
            <section class="flex items-center gap-2">
              <UIcon name="lucide:square-user-round" class="size-6" />
              <p class="font-bold text-lg">
                {{ $t("pages.settings.account-info.title") }}
              </p>
            </section>
          </template>

          <template #body>
            <section class="flex flex-col gap-0.5">
              <p class="text-sm">
                {{ $t("pages.settings.account-info.account-id") }}
              </p>
              <p
                class="font-mono"
                v-if="typeof profileStore.profile !== 'undefined'"
              >
                {{ profileStore.profile._id }}
              </p>
            </section>
          </template>
        </Container>
      </section>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import Container from "~/components/containers/Container.vue";
import XButton from "~/components/utilities/XButton.vue";
import ProfileSettings from "~/components/settings/ProfileSettings.vue";
import SecuritySettings from "~/components/settings/SecuritySettings.vue";

definePageMeta({
  middleware: "auth",
});

const profileStore = useProfileStore();
const colorMode = useColorMode();

const selectColorScheme = (scheme: "light" | "dark" | "system") => {
  colorMode.preference = scheme;
};

onBeforeMount(async () => {
  if (!profileStore.profile) await profileStore.fetchProfile();
});
</script>
