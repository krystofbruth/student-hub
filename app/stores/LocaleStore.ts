import { defineStore } from "pinia";
import { ref } from "vue";

export enum Locale {
  english = "en",
  czech = "cs",
}

const LOCALE_LOCAL_STORAGE_KEY = "locale";
const DEFAULT_LOCALE = Locale.czech;

export const useLocaleStore = defineStore("locale", () => {
  const currentLocale = ref<Locale>(DEFAULT_LOCALE);

  const setCurrentLocale = (locale: Locale) => {
    currentLocale.value = locale;
  };

  const saveLocalePreference = (locale: Locale) => {
    localStorage.setItem(LOCALE_LOCAL_STORAGE_KEY, locale);
  };

  /** The localStorage value (if user unauth). */
  const readLocalePreference = (): Locale | undefined => {
    const savedValue = localStorage.getItem(LOCALE_LOCAL_STORAGE_KEY);
    if (!savedValue) return;

    return savedValue as Locale;
  };

  return {
    saveLocalePreference,
    setCurrentLocale,
    readLocalePreference,
    currentLocale,
  };
});
