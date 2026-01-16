<template>
  <div class="Integrations">
    <h1>Integrations</h1>
    <article>
      <h2>Your integrations</h2>
    </article>

    <article>
      <h2>Available integrations</h2>
      <section>
        <p>Filtering by school...</p>
      </section>
      <section class="w-full grid grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
        <IntegrationCard
          v-for="integration in integrations"
          :key="integration.title"
          :title="integration.title"
          ,
          :description="integration.description"
          :logo-uri="integration.logoUri"
        />
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
import IntegrationCard from "~/components/integrations/IntegrationCard.vue";

interface Integration {
  title: string;
  logoUri: string;
  description: {
    en: string;
    cs: string;
  };
}

// TODO - Fetch from server
const integrations: Integration[] = [
  {
    title: "SSPŠ Cajthaml",
    logoUri: "https://ssps.cajthaml.eu/img/icon-main-for-dark-main.png",
    description: {
      en: "Integration of SSPŠ Cajthaml on-line service.",
      cs: "Integrace portálu SSPŠ Cajthaml.",
    },
  },
];
</script>
