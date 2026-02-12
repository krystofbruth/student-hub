<template>
  <div class="flex flex-col gap-2">
    <article v-for="rule in rules" class="flex gap-1 items-center">
      <UIcon v-if="rule.valid.value" name="lucide:check" />
      <UIcon v-else name="lucide:x" />
      <p class="text-sm">
        {{ $t(`components.PasswordChecker.ruleTitles.${rule.titleKey}`) }}
      </p>
    </article>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ password: string }>();
const valid = defineModel<boolean>();

interface Rule {
  titleKey: string;
  valid: ComputedRef<boolean>;
}

const rules: Rule[] = [
  {
    titleKey: "minimalCharacterCount",
    valid: computed(() => props.password.length >= 8),
  },
  {
    titleKey: "uppercaseCharacter",
    valid: computed(() => {
      return /[A-Z]/.test(props.password);
    }),
  },
  {
    titleKey: "lowercaseCharacter",
    valid: computed(() => {
      return /[a-z]/.test(props.password);
    }),
  },
  {
    titleKey: "specialCharacter",
    valid: computed(() => {
      return /[!-@]/.test(props.password);
    }),
  },
];
</script>
