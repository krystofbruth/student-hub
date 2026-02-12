import { defineStore } from "pinia";
import { watch } from "vue";
import type { SupportedLanguages } from "~~/shared/types/SupportedLanguages";
import type { UpdateUserSelfRequest } from "#shared/types/UpdateUserSelfRequest";
import { request } from "../utils/api";
import type { Result } from "~/types/Result";
import { ApiException } from "~/types/Exceptions";

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
  const profile = ref<Profile | undefined>(undefined);

  const fetchProfile = async (): Promise<Result<undefined>> => {
    const res = await request<undefined, FetchUserSelfResponse>(
      "/api/user/me",
      { method: "GET", authRequired: true, body: undefined },
    );
    if (
      !res.success &&
      res.error instanceof ApiException &&
      res.error.reason === "authorization"
    ) {
      profile.value = undefined;
      return res;
    } else if (!res.success) return res;

    setUser(res.data.user);
    return { success: true, data: undefined };
  };

  const updateProfile = async (
    update: UpdateUserSelfRequest,
  ): Promise<Result<undefined>> => {
    const res = await request<UpdateUserSelfRequest, UpdateUserSelfResponse>(
      "/api/user/me",
      { method: "PATCH", authRequired: true, body: update },
    );
    if (!res.success) return res;

    setUser(res.data.user);
    return { success: true, data: undefined };
  };

  const setUser = (userResponse: UserResponse) => {
    profile.value = mapUserResponseToProfile(userResponse);
    i18n.setLocale(profile.value.language);
  };

  fetchProfile();

  return { profile, updateProfile, fetchProfile };
});
