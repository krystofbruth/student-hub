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
      <UButton color="info" class="cursor-pointer w-fit"
        ><UIcon name="lucide:arrow-up-right" /><a
          href="https://ssps.cajthaml.eu/user/verify"
          target="_blank"
          >{{
            $t(
              "integrations.ssps_cajthaml.sourceCreation.verificationWebsiteButton",
            )
          }}</a
        ></UButton
      >
    </section>

    <section class="flex flex-col gap-2">
      <p>
        2.
        {{
          $t(
            "integrations.ssps_cajthaml.sourceCreation.instructionsVerificationTokenInput",
          )
        }}
      </p>
      <UInput
        type="text"
        class="w-fit"
        :placeholder="
          $t(
            'integrations.ssps_cajthaml.sourceCreation.verificationTokenInputPlaceholder',
          )
        "
      />

      <UButton color="info" class="cursor-pointer w-fit" @click="handleClose"
        ><UIcon name="lucide:link" />{{
          $t("integrations.ssps_cajthaml.sourceCreation.submitButton")
        }}</UButton
      >
    </section>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ origin: OriginView; closeSuccess: () => void }>();

const handleClose = () => {
  props.closeSuccess();
};
</script>
