import pkg from "./package.json";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/test-utils",
    "@nuxt/ui",
    "@pinia/nuxt",
    "@nuxtjs/i18n",
  ],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    dbUri: process.env.DB_URI || "mongodb://127.0.0.1:27017",
    emailVerification: false,
    appVersion: pkg.version,
    allowedDomains: ["skola.ssps.cz", "ssps.cz"],
  },
  nitro: {
    experimental: {
      openAPI: false,
    },
    openAPI: {
      meta: {
        title: "StudentHub API",
        description: "Student information aggregation tool.",
        version: "0.1.0",
      },
      production: "prerender",
    },
    errorHandler: "~/../server/utilities/ErrorHandler.ts",
  },
  ssr: false,
  i18n: {
    defaultLocale: "cs",
    locales: [
      { code: "en", name: "English", file: "en.json" },
      { code: "cs", name: "Čeština", file: "cs.json" },
    ],
    strategy: "no_prefix",
    detectBrowserLanguage: {
      /** On profile load, the locale is set based on the profile settings in the db. */
      useCookie: false,
    },
  },
});
