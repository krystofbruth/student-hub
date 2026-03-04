<template>
  <UModal :title="$t('modals.appMeta.title')">
    <p class="text-muted cursor-pointer hover:text-inherit" @click="!open">
      v{{ appVersion }}
    </p>

    <template #body>
      <p>
        <span class="font-bold">{{ $t("modals.appMeta.appVersion") }}:</span>
        {{ appVersion }}
      </p>
      <p>
        <span class="font-bold">{{ $t("modals.appMeta.buildId") }}: </span>

        <span v-if="!buildId">...</span>
        <span v-else>{{ buildId }}</span>
      </p>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const open = ref(false);
const buildId = ref<undefined | string>(undefined);

onMounted(async () => {
  try {
    const res = await fetch("/_nuxt/builds/latest.json");
    if (!res.ok) throw res;

    const meta = await res.json();
    buildId.value = meta.id;
  } catch (error) {
    console.error(error);
    buildId.value = "ERR";
  }
});
</script>
