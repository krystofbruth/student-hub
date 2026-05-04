<template>
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
      <UForm
        class="box-border flex flex-col gap-2"
        :state="state"
        :validate="handleValidation"
        :disabled="saveStateHandler.isLoading.value || !profileStore.profile"
        @submit="saveStateHandler.handle"
      >
        <section>
          <UFormField
            :label="$t('pages.settings.displayNameLabel')"
            name="displayName"
          >
            <UInput
              v-model="state.displayName"
              class="w-full"
              :placeholder="$t('pages.settings.displayNameLabel')"
            />
          </UFormField>
        </section>

        <footer class="w-full flex justify-end">
          <XButton
            title-key="pages.settings.saveButton"
            icon-key="lucide:check"
            type="submit"
            :is-loading="saveStateHandler.isLoading.value"
          />
        </footer>
      </UForm>
    </template>
  </Container>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "@nuxt/ui";
import z from "zod";
import Container from "~/components/containers/Container.vue";
import XButton from "~/components/utilities/XButton.vue";
import type { UpdateUserSelfRequest } from "#shared/types/UpdateUserSelfRequest";

const profileStore = useProfileStore();
const toast = useToast();
const apiExceptionHandler = useApiExceptionErrorHandler();

const state = reactive({
  displayName: "",
});

const profileSettingsSchema = z.object({
  displayName: z.string().trim().min(3),
});

watch(
  () => profileStore.profile?.displayName,
  (displayName) => {
    if (typeof displayName === "string") state.displayName = displayName;
  },
  { immediate: true },
);

const handleValidation = (): FormError[] => {
  const errors: FormError[] = [];
  const parse = profileSettingsSchema.safeParse(state);

  if (!parse.success) {
    errors.push({
      name: "displayName",
      message: $t("pages.settings.displayNameError"),
    });
  }

  return errors;
};

const handleSubmit = async (event: FormSubmitEvent<UpdateUserSelfRequest>) => {
  const displayName = event.data.displayName?.trim();
  if (!profileStore.profile || !displayName) return;

  if (displayName === profileStore.profile.displayName) return;

  const res = await profileStore.updateProfile({ displayName });
  if (!res.success) {
    apiExceptionHandler.handleException(res.error);
    return;
  }

  state.displayName = displayName;
  toast.add({
    title: $t("toasts.profile.updateSuccess.title"),
    description: $t("toasts.profile.updateSuccess.description"),
    color: "success",
  });
};

const saveStateHandler = useStateHandler(handleSubmit);
</script>
