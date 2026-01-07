import { defineStore } from "pinia";
import { watch } from "vue";

export interface Profile {
  _id: string;
  email: string;
  displayName: string;
  username: string;
  lastSync: Date;
}

export const useProfileStore = defineStore("profile", () => {
  //   const profileStore = useProfileStore();
  const authorizationStore = useAuthorizationStore();
  const { authorized } = storeToRefs(authorizationStore);
  const profile = ref<Profile | undefined>(undefined);

  const profileCheck = async () => {
    if (await authorizationStore.isAuthorized()) {
      await fetchProfile();
    } else {
      profile.value = undefined;
    }
  };

  const fetchProfile = async () => {
    // TODO - when fetched, call setLocale to set the locale.
  };

  profileCheck();
  watch(authorized, profileCheck);

  return { profile };
});
