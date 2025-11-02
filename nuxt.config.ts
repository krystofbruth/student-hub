// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/test-utils", "@nuxt/ui"],
  runtimeConfig: {
    dbUri: "mongodb://127.0.0.1:27017",
  },
});
