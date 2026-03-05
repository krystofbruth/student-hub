<template>
  <div class="flex flex-col items-center gap-6 max-w-90">
    <UIcon name="lucide:user-check" class="size-20" />

    <section class="flex flex-col gap-3">
      <p class="text-center">
        {{ $t("pages.user-registration-result.success.description") }}
      </p>

      <NuxtLink
        to="/login"
        class="font-bold flex items-center gap-1 self-center"
        >{{ $t("pages.user-registration-result.success.loginButton") }}
        <UIcon name="lucide:arrow-right" class="size-5"
      /></NuxtLink>
    </section>
  </div>
</template>
