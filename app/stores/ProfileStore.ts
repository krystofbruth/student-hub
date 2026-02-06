import { defineStore } from "pinia";
import { watch } from "vue";
import type { SupportedLanguages } from "~~/shared/types/SupportedLanguages";
import type { UpdateUserSelfRequest } from "#shared/types/UpdateUserSelfRequest";
import { useFetchHandlerStore } from "~/handlers/FetchHandler";

export interface Profile {
  _id: string;
  email: string;
  displayName: string;
  username: string;
  lastSync: Date;
  language: SupportedLanguages;
}

const mapUserResponseToProfile = (u: UserResponse): Profile => {
  return {
    _id: u._id,
    email: u.email,
    displayName: u.displayName,
    username: u.username,
    lastSync: new Date(u.lastSync),
    language: u.language,
  };
};

export const useProfileStore = defineStore("profile", () => {
  const i18n = useI18n();
  const authorizationStore = useAuthorizationStore();
  const { authorized } = storeToRefs(authorizationStore);
  const profile = ref<Profile | undefined>(undefined);
  const fetchHandler = useFetchHandlerStore();

  const profileCheck = async () => {
    if (await authorizationStore.isAuthorized()) {
      await fetchProfile();
    } else {
      profile.value = undefined;
    }
  };

  const fetchProfile = async () => {
    try {
      const authorization = await authorizationStore.getAuthorization();
      if (!authorization) return;
      const res = await $fetch("/api/user/me", {
        headers: { Authorization: authorization },
      });
      if (!res.success) return;

      profile.value = mapUserResponseToProfile(res.user);
    } catch (error) {
      return;
    }

    i18n.setLocale(profile.value.language);
  };

  const updateProfile = async (
    update: UpdateUserSelfRequest,
  ): Promise<boolean> => {
    const res = await fetchHandler.handleRequest<
      UpdateUserSelfRequest,
      UpdateUserSelfResponse
    >("/api/user/me", "PATCH", true, update);
    return res.success;
  };

  profileCheck();
  watch(authorized, profileCheck);

  return { profile, updateProfile };
});
