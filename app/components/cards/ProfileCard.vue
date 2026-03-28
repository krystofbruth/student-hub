<template>
  <article
    class="rounded-md box-border flex items-center h-8 gap-3 select-none"
  >
    <p class="font-bold">{{ profile?.displayName }}</p>
    <img
      class="object-fill rounded-full h-full"
      src="/unknown-user.jpg"
      alt="User's profile picture"
    />
    <slot name="menu" />
  </article>
</template>

<script setup lang="ts">
const profileStore = useProfileStore();
const props = defineProps<{
  profileId: "me" | string;
}>();

onMounted(() => {
  profileStore.fetchProfile();
});

const profile = computed(() => {
  if (props.profileId === "me") return profileStore.profile;
  else return { displayName: "Anonymous Cat", _id: "dummy_id" };
});
</script>
