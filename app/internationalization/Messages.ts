export enum MESSAGE_KEY {
  LOGIN,
  LOGIN_IN_PROGRESS,
}

export const MESSAGE: Record<MESSAGE_KEY, Record<Locale, string>> = {
  [MESSAGE_KEY.LOGIN]: { en: "Log-in", cs: "Přihlásit se" },
  [MESSAGE_KEY.LOGIN_IN_PROGRESS]: { en: "Logging-in", cs: "Přihlašuji" },
};
