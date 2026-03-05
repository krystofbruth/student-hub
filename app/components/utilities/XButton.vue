<template>
  <UButton
    class="flex justify-between items-center cursor-pointer"
    :class="{
      'grayscale-25': props.isLoading,
      'cursor-not-allowed': props.isLoading,
    }"
    type="submit"
    >{{ $t(props.titleKey)
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
  titleKey: string;
  iconKey?: string;
  iconPosition?: "before" | "after";
  type?: "button" | "submit" | "reset";
  isLoading?: boolean;
}>();
</script>
