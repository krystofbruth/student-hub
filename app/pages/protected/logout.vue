<script setup lang="ts">
import { useAuthorizationStore } from "#imports";
const authorizationStore = useAuthorizationStore();

onMounted(() => {
  authorizationStore.logoutUser();
});
</script>
