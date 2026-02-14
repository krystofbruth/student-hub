<template>
  <div class="flex flex-col gap-6 max-w-90 items-center">
    <UIcon name="lucide:mail-plus" class="size-20" />

    <section class="flex flex-col gap-3">
      <p>
        {{
          $t("pages.user-registration-result.email-verification.description")
        }}
      </p>
      <p class="font-bold">
        {{
          $t("pages.user-registration-result.email-verification.resendTimeout")
        }}
      </p>

      <UButton color="neutral" class="cursor-not-allowed"
        >{{ $t("pages.user-registration-result.email-verification.sendAgain") }}
      </UButton>
    </section>
  </div>
</template>

<script setup lang="ts">
const timeDurationHandler = useTimeDurationHandler();
</script>
