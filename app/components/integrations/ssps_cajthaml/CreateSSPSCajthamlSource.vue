<template>
  <div class="flex flex-col items-start w-full gap-4 relative">
    <!-- Cajthaml is going to kill me once he realises there isn't a `ul`, but I'm too lazy to implement -->
    <section class="flex flex-col gap-2">
      <p>
        1.
        {{
          $t("integrations.ssps_cajthaml.sourceCreation.instructionsWebsite")
        }}
      </p>

      <a
        href="https://ssps.cajthaml.eu/user/verify"
        target="_blank"
        class="w-fit"
      >
        <UButton color="info" class="cursor-pointer w-fit"
          ><UIcon name="lucide:arrow-up-right" />{{
            $t(
              "integrations.ssps_cajthaml.sourceCreation.verificationWebsiteButton",
            )
          }}
        </UButton>
      </a>
    </section>

    <UForm
      class="flex flex-col gap-2"
      @submit="creationStateHandler.handle"
      :state="state"
      :schema="CreateSSPSCajthamlSourceCredentialsSchema"
    >
      <p>
        2.
        {{
          $t(
            "integrations.ssps_cajthaml.sourceCreation.instructionsVerificationTokenInput",
          )
        }}
      </p>

      <UFormField name="verificationToken">
        <UInput
          type="text"
          class="w-fit"
          v-model="state.verificationToken"
          :placeholder="
            $t(
              'integrations.ssps_cajthaml.sourceCreation.verificationTokenInputPlaceholder',
            )
          "
        />
      </UFormField>

      <XButton
        title-key="integrations.ssps_cajthaml.sourceCreation.submitButton"
        icon-key="lucide:link"
        color="info"
        type="submit"
        :is-loading="creationStateHandler.isLoading.value"
        icon-position="before"
        class="w-fit"
      />
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "@nuxt/ui";
import XButton from "~/components/utilities/XButton.vue";
import { ApiException } from "~/types/Exceptions";
import {
  CreateSSPSCajthamlSourceCredentialsSchema,
  type CreateSSPSCajthamlSourceCredentials,
} from "~~/shared/types/integrations/ssps_cajthaml/CreateSource";

const toast = useToast();
const apiExceptionHandler = useApiExceptionErrorHandler();
const sourceStore = useSourceStore();
const props = defineProps<{ origin: OriginView; closeSuccess: () => void }>();
const state = reactive<CreateSSPSCajthamlSourceCredentials>({
  verificationToken: "",
});

const handleSubmit = async (
  event: FormSubmitEvent<CreateSSPSCajthamlSourceCredentials>,
) => {
  const res = await sourceStore.createSource(props.origin._id, event.data);
  if (!res.success) {
    if (
      res.error instanceof ApiException &&
      res.error.details.response &&
      res.error.details.response.code === ErrorCodes.VALIDATION_ERROR &&
      (res.error.details.response as ValidationErrorResponse).issues[
        "verificationToken"
      ]?.at(0) === "invalid-verification-token"
    ) {
      toast.add({
        title: $t(
          "integrations.ssps_cajthaml.sourceCreation.invalidVerificationTokenToast.title",
        ),
        description: $t(
          "integrations.ssps_cajthaml.sourceCreation.invalidVerificationTokenToast.description",
        ),
        color: "error",
      });
    } else {
      apiExceptionHandler.handleException(res.error);
    }
    return;
  }

  props.closeSuccess();
};

const creationStateHandler = useStateHandler(handleSubmit);
</script>
