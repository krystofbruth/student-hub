<template>
  <button
    class="flex items-center gap-1 text-muted hover:cursor-pointer"
    @click="handleLocaleSwitch"
  >
    <UIcon name="lucide:languages" />
    {{ locale }}
  </button>
</template>

<script setup lang="ts">
const { setLocale, locale } = useI18n();
const profile = useProfileStore();
const toast = useToast();

const handleLocaleSwitch = async () => {
  const previousLocale = locale.value;

  switch (locale.value) {
    case "en":
      await setLocale("cs");
      break;
    case "cs":
    default:
      await setLocale("en");
      break;
  }

  if (profile.profile) {
    console.log(locale.value);

    // Guh?
    const res = await profile.updateProfile({
      language: locale.value as SupportedLanguages,
    });

    if (!res) {
      setLocale(previousLocale);
      return;
    }

    toast.add({
      color: "success",
      title: $t("toasts.profile.updateSuccess.title"),
      description: $t("toasts.profile.updateSuccess.description"),
    });
  }
};
</script>
