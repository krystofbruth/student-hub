<template>
  <UButton
    class="flex justify-between items-center cursor-pointer"
    :color="props.color || 'primary'"
    :variant="props.variant"
    :class="{
      'grayscale-25': props.isLoading,
      'cursor-not-allowed': props.isLoading,
    }"
    type="submit"
    >{{ props.titleKey ? $t(props.titleKey) : ""
    }}<UIcon
      class="size-4"
      :class="{
        '-order-1': props.iconPosition === 'before',
        'animate-spin': props.isLoading,
      }"
      :name="
        props.isLoading
          ? 'lucide:loader-circle'
          : props.iconKey || 'lucide:arrow-right'
      "
  /></UButton>
</template>

<script setup lang="ts">
// Named XButton to not be confused with UButton & regular button elements
const props = defineProps<{
  titleKey?: string;
  iconKey?: string;
  iconPosition?: "before" | "after";
  type?: "button" | "submit" | "reset";
  isLoading?: boolean;
  color?:
    | "error"
    | "primary"
    | "secondary"
    | "success"
    | "info"
    | "warning"
    | "neutral";
  variant?: "link" | "outline" | "soft" | "subtle" | "ghost" | "solid";
}>();
</script>
