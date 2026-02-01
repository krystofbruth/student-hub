<template>
  <section>
    <article class="p-4 rounded-md bg-accented box-border">
      <header class="flex items-center gap-2">
        <UIcon name="lucide:square-user-round" class="size-6" />
        <p class="font-bold text-lg">
          {{ $t("pages.settings.profile-title") }}
        </p>
      </header>
      <section class="h-48">
        <img
          class="rounded-full w-48 h-48"
          src="/unknown-user.jpg"
          alt="Profile picture"
        />
      </section>
    </article>
  </section>
</template>
