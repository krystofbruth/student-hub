<template>
  <NuxtLayout name="protected-layout">
    <h1>{{ $t("pages.integrations.title") }}</h1>

    <article
      class="bg-accented rounded-md p-3 box-border flex flex-col gap-2.5"
    >
      <h2 class="text-xl font-bold">
        {{ $t("pages.integrations.my-sources") }}
      </h2>
      <section class="flex flex-col lg:flex-row gap-5">
        <!-- Minimum width set to the actual min-width of the SourceCard -->
        <section
          class="order-1 grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-3 grow"
        >
          <SourceCard
            v-for="source in sourceStore.sources"
            :key="source._id"
            :source-id="source._id"
          ></SourceCard>
        </section>
        <aside class="order-0 lg:order-2 md:min-w-[300px]">
          <AuditComponent />
        </aside>
      </section>
    </article>

    <!-- <section class="flex flex-col md:flex-row gap-5">
         <article class="flex flex-col grow basis-0 gap-2">
          <h2 class="text-xl font-bold">
            {{ $t("pages.integrations.available-schools") }}
          </h2>
          <p>{{ $t("pages.integrations.schools-description") }}</p>
           TODO: Search, query must be implemented on the backend! -->
    <!-- <UInput
          :placeholder="
            $t('pages.integrations.school-search.query-placeholder')
          "
          v-model="partnerInstitutionsSearch"
          @input="fetchPartnerSchools"
        /> -->
    <!-- <p v-if="partnerInstitutions.length === 0">
          {{ $t("pages.integrations.school-search.no-items-found") }}
        </p> -->
    <!--
          <section class="flex flex-col gap-2">
            <ProviderCard
              v-for="partnerInstitution in partnerInstitutions"
              :provider-id="partnerInstitution._id"
            />
          </section>
        </article> -->

    <!-- </section> -->

    <article class="flex flex-col gap-2.5 grow basis-0">
      <h2 class="text-xl font-bold">
        {{ $t("pages.integrations.available-integrations") }}
      </h2>
      <section
        class="w-full grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-3"
      >
        <OriginCard
          v-for="origin in originStore.origins"
          :key="origin._id"
          :origin-id="origin._id"
          @connected="syncData"
        />
      </section>
    </article>
  </NuxtLayout>
</template>

<script setup lang="ts">
import AuditComponent from "~/components/AuditComponent.vue";
import SourceCard from "~/components/cards/SourceCard.vue";
import OriginCard from "~/components/cards/OriginCard.vue";

definePageMeta({ middleware: "auth" });

const toast = useToast();
const partnerInstitutions = ref<ProviderView[]>([]);
const partnerInstitutionsSearch = ref("");
const origins = ref<OriginView[]>([]);
const apiExceptionHandler = useApiExceptionErrorHandler();
const sourceStore = useSourceStore();
const originStore = useOriginStore();

const syncData = async () => {
  const sourceSync = await sourceStore.fetchSources();
  if (!sourceSync.success)
    apiExceptionHandler.handleException(sourceSync.error);

  const originSync = await originStore.fetchOrigins();
  if (!originSync.success)
    apiExceptionHandler.handleException(originSync.error);
};

onMounted(async () => {
  syncData();
});
</script>
