// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/test-utils", "@nuxt/ui"],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    dbUri: "mongodb://127.0.0.1:27017",
    emailVerification: false,
  },
  nitro: {
    experimental: {
      openAPI: true,
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
});
