<template>
  <div class="box-border flex justify-center">
    <UColorModeImage
      :light="`/${logoVariant}-light.svg`"
      :dark="`/${logoVariant}-dark.svg`"
      alt="Logo of the StudentHub app (dark variant)"
      class="h-full w-full bg-contain max-w-full"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  full?: boolean;
}>();

const logoVariant = computed((): "logo" | "favicon" => {
  if (props.full) return "logo";
  else return "favicon";
});
</script>
